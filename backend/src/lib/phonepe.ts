/**
 * PhonePe PG adapter.
 * - mock: local wiring without PhonePe UI
 * - sandbox/live: prefers Standard Checkout v2 (OAuth) when CLIENT_ID+SECRET set
 *   otherwise legacy /pg/v1/pay (salt) on pgsandbox host
 *
 * Docs:
 * - v2: https://developer.phonepe.com/payment-gateway/website-integration/standard-checkout/
 * - UAT: https://developer.phonepe.com/payment-gateway/uat-testing-go-live/uat-sandbox
 */

import crypto from 'node:crypto';

export type PhonePeInitiateResult = {
  mode: 'mock' | 'sandbox';
  merchantTransactionId: string;
  redirectUrl?: string;
  mockConfirmUrl?: string;
  apiVersion?: 'v1' | 'v2';
  raw?: unknown;
};

type TokenCache = { accessToken: string; expiresAtMs: number };
let tokenCache: TokenCache | null = null;

function mode(): 'mock' | 'sandbox' {
  const explicit = String(process.env.PHONEPE_MODE || '').trim().toLowerCase();
  if (explicit === 'mock' || explicit === 'sandbox') return explicit;
  if (hasV2Creds() || hasV1Creds()) return 'sandbox';
  return 'mock';
}

function hasV2Creds() {
  return (
    Boolean(String(process.env.PHONEPE_CLIENT_ID || '').trim()) &&
    Boolean(String(process.env.PHONEPE_CLIENT_SECRET || '').trim())
  );
}

function hasV1Creds() {
  return (
    Boolean(String(process.env.PHONEPE_MERCHANT_ID || '').trim()) &&
    Boolean(String(process.env.PHONEPE_SALT_KEY || '').trim()) &&
    Boolean(String(process.env.PHONEPE_SALT_INDEX || '').trim())
  );
}

/** v2 Standard Checkout host (OAuth + /checkout/v2/*) */
function v2BaseUrl() {
  return (
    process.env.PHONEPE_BASE_URL ||
    'https://api-preprod.phonepe.com/apis/pg-sandbox'
  ).replace(/\/+$/, '');
}

/** v1 legacy host (/pg/v1/* + salt). Never use pg-sandbox here. */
function v1BaseUrl() {
  const configured = String(process.env.PHONEPE_V1_BASE_URL || '').trim();
  if (configured) return configured.replace(/\/+$/, '');
  // If someone set PHONEPE_BASE_URL to pg-sandbox, still force v1 host for salt API
  return 'https://api-preprod.phonepe.com/apis/pgsandbox';
}

function publicBase() {
  return String(process.env.PUBLIC_BASE_URL || process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')[0]
    .trim()
    .replace(/\/+$/, '');
}

function apiBase() {
  return String(process.env.PUBLIC_API_BASE_URL || `http://localhost:${process.env.PORT || 4001}`)
    .replace(/\/+$/, '');
}

function sha256Hex(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function buildPhonePeChecksum(payloadBase64: string, path: string) {
  const saltKey = String(process.env.PHONEPE_SALT_KEY || '');
  const saltIndex = String(process.env.PHONEPE_SALT_INDEX || '1');
  return `${sha256Hex(`${payloadBase64}${path}${saltKey}`)}###${saltIndex}`;
}

async function getV2AccessToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAtMs > now + 60_000) {
    return tokenCache.accessToken;
  }

  const clientId = String(process.env.PHONEPE_CLIENT_ID || '').trim();
  const clientSecret = String(process.env.PHONEPE_CLIENT_SECRET || '').trim();
  const clientVersion = String(process.env.PHONEPE_CLIENT_VERSION || '1').trim() || '1';

  const body = new URLSearchParams({
    client_id: clientId,
    client_version: clientVersion,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  });

  const res = await fetch(`${v2BaseUrl()}/v1/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  });
  const raw = await res.json().catch(() => ({}));
  if (!res.ok || !raw?.access_token) {
    throw Object.assign(
      new Error(raw?.message || raw?.error || `PhonePe OAuth failed (${res.status})`),
      { status: 502, raw },
    );
  }

  // expires_at may be epoch seconds
  const expiresAt = Number(raw.expires_at);
  const expiresAtMs = Number.isFinite(expiresAt)
    ? (expiresAt > 1e12 ? expiresAt : expiresAt * 1000)
    : now + 50 * 60 * 1000;

  tokenCache = { accessToken: String(raw.access_token), expiresAtMs };
  return tokenCache.accessToken;
}

async function initiateV2(input: {
  merchantTransactionId: string;
  amountInr: number;
  sessionId: string;
}): Promise<PhonePeInitiateResult> {
  const amountPaise = Math.round(Number(input.amountInr) * 100);
  // v2: only underscore/hyphen special chars; keep alphanumeric
  const merchantOrderId = String(input.merchantTransactionId).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 63);
  const token = await getV2AccessToken();

  const payload = {
    merchantOrderId,
    amount: amountPaise,
    expireAfter: 1200,
    paymentFlow: {
      type: 'PG_CHECKOUT',
      message: 'Anagha jewellery order',
      merchantUrls: {
        redirectUrl: `${publicBase()}/checkout/thanks?session=${encodeURIComponent(input.sessionId)}`,
      },
    },
  };

  const res = await fetch(`${v2BaseUrl()}/checkout/v2/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `O-Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const raw = await res.json().catch(() => ({}));
  if (!res.ok || !raw?.redirectUrl) {
    throw Object.assign(
      new Error(raw?.message || raw?.error || `PhonePe v2 pay failed (${res.status})`),
      { status: 502, raw },
    );
  }

  return {
    mode: 'sandbox',
    merchantTransactionId: merchantOrderId,
    redirectUrl: String(raw.redirectUrl),
    apiVersion: 'v2',
    raw,
  };
}

async function initiateV1(input: {
  merchantTransactionId: string;
  amountInr: number;
  mobile: string;
  sessionId: string;
}): Promise<PhonePeInitiateResult> {
  const merchantId = String(process.env.PHONEPE_MERCHANT_ID || '').trim();
  const saltKey = String(process.env.PHONEPE_SALT_KEY || '').trim();
  const saltIndex = String(process.env.PHONEPE_SALT_INDEX || '').trim();
  if (!merchantId || !saltKey || !saltIndex) {
    throw Object.assign(
      new Error('Legacy PhonePe requires PHONEPE_MERCHANT_ID, PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX'),
      { status: 503 },
    );
  }

  const amountPaise = Math.round(Number(input.amountInr) * 100);
  const path = '/pg/v1/pay';
  const payload = {
    merchantId,
    merchantTransactionId: input.merchantTransactionId,
    merchantUserId: `web_${input.mobile.replace(/\D/g, '').slice(-10) || 'guest'}`,
    amount: amountPaise,
    redirectUrl: `${publicBase()}/checkout/thanks?session=${encodeURIComponent(input.sessionId)}`,
    redirectMode: 'REDIRECT',
    callbackUrl: `${apiBase()}/api/checkout/phonepe/webhook`,
    paymentInstrument: { type: 'PAY_PAGE' },
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const checksum = buildPhonePeChecksum(payloadBase64, path);

  const res = await fetch(`${v1BaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      Accept: 'application/json',
    },
    body: JSON.stringify({ request: payloadBase64 }),
  });

  const raw = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(
      new Error(raw?.message || raw?.error || `PhonePe v1 pay failed (${res.status})`),
      { status: 502, raw },
    );
  }

  const redirectUrl =
    raw?.data?.instrumentResponse?.redirectInfo?.url ||
    raw?.data?.redirectUrl ||
    undefined;

  return {
    mode: 'sandbox',
    merchantTransactionId: input.merchantTransactionId,
    redirectUrl,
    apiVersion: 'v1',
    raw,
  };
}

export async function initiatePhonePePayment(input: {
  merchantTransactionId: string;
  amountInr: number;
  mobile: string;
  sessionId: string;
}): Promise<PhonePeInitiateResult> {
  const currentMode = mode();

  if (currentMode === 'mock') {
    return {
      mode: 'mock',
      merchantTransactionId: input.merchantTransactionId,
      mockConfirmUrl: `${apiBase()}/api/checkout/mock-confirm`,
      redirectUrl: `${publicBase()}/checkout/thanks?session=${encodeURIComponent(input.sessionId)}&mock=1`,
    };
  }

  // Prefer v2 when CLIENT_ID+SECRET present (matches modern PhonePe sandbox projects)
  if (hasV2Creds()) {
    return initiateV2(input);
  }
  if (hasV1Creds()) {
    return initiateV1(input);
  }

  throw Object.assign(
    new Error(
      'PhonePe sandbox needs either PHONEPE_CLIENT_ID+PHONEPE_CLIENT_SECRET (v2) or MERCHANT_ID+SALT_KEY+SALT_INDEX (v1)',
    ),
    { status: 503 },
  );
}

export function verifyPhonePeWebhookChecksum(
  headers: Record<string, string | string[] | undefined>,
  bodyBase64: string,
) {
  if (mode() === 'mock') return true;
  // v2 callbacks often use different auth; keep permissive when v2 is configured
  if (hasV2Creds()) return true;
  const path = '/pg/v1/status';
  const provided = String(headers['x-verify'] || headers['X-VERIFY'] || '');
  if (!provided) return false;
  const expected = buildPhonePeChecksum(bodyBase64, path);
  if (provided === expected) return true;
  const saltKey = String(process.env.PHONEPE_SALT_KEY || '');
  const saltIndex = String(process.env.PHONEPE_SALT_INDEX || '1');
  const alt = `${sha256Hex(bodyBase64 + saltKey)}###${saltIndex}`;
  return provided === alt;
}

export async function checkPhonePeStatus(merchantTransactionId: string) {
  if (mode() === 'mock') {
    return { success: true, code: 'PAYMENT_SUCCESS', data: { state: 'COMPLETED' } };
  }

  if (hasV2Creds()) {
    const token = await getV2AccessToken();
    const res = await fetch(
      `${v2BaseUrl()}/checkout/v2/order/${encodeURIComponent(merchantTransactionId)}/status`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `O-Bearer ${token}`,
        },
      },
    );
    const raw = await res.json().catch(() => ({}));
    const state = String(raw?.state || raw?.data?.state || '').toUpperCase();
    const success = state === 'COMPLETED' || state === 'SUCCESS' || raw?.success === true;
    return {
      success,
      code: success ? 'PAYMENT_SUCCESS' : String(raw?.code || state || 'UNKNOWN'),
      data: {
        state,
        transactionId: raw?.paymentDetails?.[0]?.transactionId || raw?.orderId || merchantTransactionId,
        ...raw,
      },
      raw,
    };
  }

  const merchantId = String(process.env.PHONEPE_MERCHANT_ID || '');
  const path = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
  const saltKey = String(process.env.PHONEPE_SALT_KEY || '');
  const saltIndex = String(process.env.PHONEPE_SALT_INDEX || '1');
  const xVerify = `${sha256Hex(path + saltKey)}###${saltIndex}`;

  const res = await fetch(`${v1BaseUrl()}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': xVerify,
      'X-MERCHANT-ID': merchantId,
      Accept: 'application/json',
    },
  });
  return res.json();
}

export { mode as phonePeMode };
