import { Router, type Request, type Response } from 'express';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index.js';
import { checkoutSessions } from '../db/schema.js';
import { reserveOnErp, releaseOnErp, completeOnErp } from '../lib/erpWebstore.js';
import { requireCustomer } from '../lib/customerAuth.js';
import {
  initiatePhonePePayment,
  verifyPhonePeWebhookChecksum,
  checkPhonePeStatus,
  phonePeMode,
} from '../lib/phonepe.js';

const router = Router();

/** Express 5 types params as string | string[]; Drizzle eq() needs a string. */
function paramId(req: Request, name = 'id'): string {
  const raw = req.params[name];
  return Array.isArray(raw) ? String(raw[0] || '') : String(raw || '');
}

function handle(err: unknown, res: Response) {
  const status =
    typeof err === 'object' && err && 'status' in err
      ? Number((err as { status: number }).status) || 500
      : 500;
  const message = err instanceof Error ? err.message : 'Checkout failed';
  res.status(status).json({ error: message });
}

function publicSession(row: typeof checkoutSessions.$inferSelect) {
  return {
    id: row.id,
    status: row.status,
    tag_number: row.tagNumber,
    amount: Number(row.amount),
    currency: row.currency,
    customer_name: row.customerName,
    customer_mobile: row.customerMobile,
    customer_email: row.customerEmail,
    erp_bill_id: row.erpBillId,
    erp_bill_number: row.erpBillNumber,
    expires_at: row.expiresAt,
    payment_mode: phonePeMode(),
  };
}

async function finalizePaidSession(sessionId: string, paymentRef: string) {
  const rows = await db
    .select()
    .from(checkoutSessions)
    .where(eq(checkoutSessions.id, sessionId))
    .limit(1);
  const session = rows[0];
  if (!session) {
    throw Object.assign(new Error('Checkout session not found'), { status: 404 });
  }
  if (session.status === 'paid') {
    return session;
  }
  if (session.status !== 'pending' && session.status !== 'payment_initiated') {
    throw Object.assign(new Error(`Session cannot be completed from status ${session.status}`), {
      status: 409,
    });
  }
  if (!session.customerName || !session.customerMobile) {
    throw Object.assign(new Error('Customer details missing on session'), { status: 400 });
  }

  const complete = await completeOnErp({
    checkoutSessionId: session.id,
    paymentRef,
    paidAmount: Number(session.amount),
    customer: {
      name: session.customerName,
      mobile: session.customerMobile,
      email: session.customerEmail || undefined,
    },
  });

  const [updated] = await db
    .update(checkoutSessions)
    .set({
      status: 'paid',
      phonepeTxnId: paymentRef,
      erpBillId: complete.bill?.id || null,
      erpBillNumber: complete.bill?.bill_number || null,
      paymentPayload: { complete },
      updatedAt: new Date(),
    })
    .where(eq(checkoutSessions.id, session.id))
    .returning();

  return updated;
}

/** POST /api/checkout/session — reserve ERP item + start PhonePe (auth required). */
router.post('/session', requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = req.customer!;
    const tag = String(req.body.tag_number || '').trim().toUpperCase();
    const name = customer.name;
    const mobile = customer.mobile;
    const email = customer.email;

    if (!tag) return res.status(400).json({ error: 'tag_number is required' });
    if (!name || !mobile) {
      return res.status(400).json({ error: 'Account is missing name or mobile' });
    }

    const sessionId = uuidv4();
    // PhonePe v2: alphanumeric / _ / - only, max 63 chars
    const merchantTxnId = `ANAGHA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const reserved = await reserveOnErp({
      checkoutSessionId: sessionId,
      tags: [tag],
    });

    const amount = Number(reserved.total_amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      await releaseOnErp(sessionId).catch(() => undefined);
      return res.status(400).json({ error: 'Reserved item has invalid amount' });
    }

    const line = reserved.items?.[0];
    const expiresAt = reserved.expires_at ? new Date(reserved.expires_at) : null;

    try {
      await db.insert(checkoutSessions).values({
        id: sessionId,
        status: 'pending',
        tagNumber: tag,
        inventoryId: line?.inventory_id || null,
        amount: String(amount),
        currency: 'INR',
        websiteCustomerId: customer.id,
        customerName: name,
        customerMobile: mobile,
        customerEmail: email || null,
        phonepeMerchantTxnId: merchantTxnId,
        expiresAt,
      });

      const payment = await initiatePhonePePayment({
        merchantTransactionId: merchantTxnId,
        amountInr: amount,
        mobile,
        sessionId,
      });

      await db
        .update(checkoutSessions)
        .set({
          status: 'payment_initiated',
          paymentPayload: payment as unknown as Record<string, unknown>,
          updatedAt: new Date(),
        })
        .where(eq(checkoutSessions.id, sessionId));

      const rows = await db
        .select()
        .from(checkoutSessions)
        .where(eq(checkoutSessions.id, sessionId))
        .limit(1);

      res.json({
        data: {
          session: publicSession(rows[0]),
          payment,
        },
      });
    } catch (inner) {
      await releaseOnErp(sessionId).catch(() => undefined);
      await db
        .update(checkoutSessions)
        .set({ status: 'failed', updatedAt: new Date() })
        .where(eq(checkoutSessions.id, sessionId))
        .catch(() => undefined);
      throw inner;
    }
  } catch (err) {
    handle(err, res);
  }
});

/** GET /api/checkout/session/:id */
router.get('/session/:id', async (req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(checkoutSessions)
      .where(eq(checkoutSessions.id, paramId(req)))
      .limit(1);
    if (!rows[0]) return res.status(404).json({ error: 'Session not found' });
    res.json({ data: publicSession(rows[0]) });
  } catch (err) {
    handle(err, res);
  }
});

/** POST /api/checkout/session/:id/cancel — release ERP hold */
router.post('/session/:id/cancel', async (req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(checkoutSessions)
      .where(eq(checkoutSessions.id, paramId(req)))
      .limit(1);
    const session = rows[0];
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.status === 'paid') {
      return res.status(409).json({ error: 'Paid session cannot be cancelled' });
    }

    await releaseOnErp(session.id).catch(() => undefined);
    const [updated] = await db
      .update(checkoutSessions)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(checkoutSessions.id, session.id))
      .returning();

    res.json({ data: publicSession(updated) });
  } catch (err) {
    handle(err, res);
  }
});

/**
 * POST /api/checkout/session/:id/confirm-payment
 * After PhonePe redirect (sandbox/live). Polls PhonePe status API then completes ERP bill.
 * Needed locally because PhonePe webhooks cannot reach localhost.
 */
router.post('/session/:id/confirm-payment', async (req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(checkoutSessions)
      .where(eq(checkoutSessions.id, paramId(req)))
      .limit(1);
    const session = rows[0];
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.status === 'paid') {
      return res.json({ data: publicSession(session) });
    }
    if (!session.phonepeMerchantTxnId) {
      return res.status(400).json({ error: 'Session has no PhonePe merchant transaction id' });
    }

    const status = await checkPhonePeStatus(session.phonepeMerchantTxnId);
    const code = String(status?.code || '');
    const state = String(status?.data?.state || status?.data?.paymentState || '').toUpperCase();
    const success =
      code === 'PAYMENT_SUCCESS' || state === 'COMPLETED' || state === 'SUCCESS' || status?.success === true;

    if (!success) {
      const pending =
        state === 'PENDING' ||
        state === 'PAYMENT_PENDING' ||
        code === 'PAYMENT_PENDING' ||
        code === 'PAYMENT_INITIATED';
      if (pending) {
        return res.status(202).json({
          error: 'Payment still pending on PhonePe',
          data: { session: publicSession(session), phonepe: status },
        });
      }
      await releaseOnErp(session.id).catch(() => undefined);
      const [failed] = await db
        .update(checkoutSessions)
        .set({ status: 'failed', paymentPayload: status, updatedAt: new Date() })
        .where(eq(checkoutSessions.id, session.id))
        .returning();
      return res.status(402).json({
        error: 'Payment not successful',
        data: { session: publicSession(failed), phonepe: status },
      });
    }

    const txnId = String(
      status?.data?.transactionId || status?.data?.providerReferenceId || session.phonepeMerchantTxnId,
    );
    const updated = await finalizePaidSession(session.id, txnId);
    res.json({ data: publicSession(updated), phonepe: status });
  } catch (err) {
    handle(err, res);
  }
});

/**
 * POST /api/checkout/mock-confirm
 * Demo path when PHONEPE_MODE=mock (or keys missing): body { session_id }
 */
router.post('/mock-confirm', async (req: Request, res: Response) => {
  try {
    if (phonePeMode() !== 'mock') {
      return res.status(400).json({ error: 'Mock confirm only allowed in PHONEPE_MODE=mock' });
    }
    const sessionId = String(req.body.session_id || '').trim();
    if (!sessionId) return res.status(400).json({ error: 'session_id required' });

    const rows = await db
      .select()
      .from(checkoutSessions)
      .where(eq(checkoutSessions.id, sessionId))
      .limit(1);
    const session = rows[0];
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const paymentRef = `MOCK-${session.phonepeMerchantTxnId || session.id}`;
    const updated = await finalizePaidSession(session.id, paymentRef);
    res.json({ data: publicSession(updated) });
  } catch (err) {
    handle(err, res);
  }
});

/** POST /api/checkout/phonepe/webhook */
router.post('/phonepe/webhook', async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const responseB64 = String(body.response || '');
    if (responseB64) {
      const ok = verifyPhonePeWebhookChecksum(req.headers as Record<string, string>, responseB64);
      if (!ok && phonePeMode() !== 'mock') {
        return res.status(401).json({ error: 'Invalid PhonePe checksum' });
      }
    }

    let parsed: Record<string, unknown> = body;
    if (responseB64) {
      try {
        parsed = JSON.parse(Buffer.from(responseB64, 'base64').toString('utf8'));
      } catch {
        parsed = body;
      }
    }

    const data = (parsed.data || parsed) as Record<string, unknown>;
    const merchantTxnId = String(data.merchantTransactionId || data.merchant_transaction_id || '');
    const txnId = String(data.transactionId || data.txnId || merchantTxnId);
    const code = String(parsed.code || data.state || '');

    if (!merchantTxnId) {
      return res.status(400).json({ error: 'merchantTransactionId missing' });
    }

    const rows = await db
      .select()
      .from(checkoutSessions)
      .where(eq(checkoutSessions.phonepeMerchantTxnId, merchantTxnId))
      .limit(1);
    const session = rows[0];
    if (!session) {
      return res.status(404).json({ error: 'Session not found for merchant txn' });
    }

    const success =
      code === 'PAYMENT_SUCCESS' ||
      String(data.state || '').toUpperCase() === 'COMPLETED' ||
      String(data.state || '').toUpperCase() === 'SUCCESS';

    if (!success) {
      await releaseOnErp(session.id).catch(() => undefined);
      await db
        .update(checkoutSessions)
        .set({ status: 'failed', paymentPayload: parsed, updatedAt: new Date() })
        .where(eq(checkoutSessions.id, session.id));
      return res.json({ ok: true, status: 'failed' });
    }

    const updated = await finalizePaidSession(session.id, txnId || merchantTxnId);
    res.json({ ok: true, status: updated.status, bill: updated.erpBillNumber });
  } catch (err) {
    handle(err, res);
  }
});

export default router;
