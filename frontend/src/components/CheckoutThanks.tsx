'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  clearCartItem,
  confirmPhonePeCheckout,
  fetchCheckoutSession,
  type CheckoutSession,
} from '@/lib/checkout';
import { formatDisplayPrice } from '@/lib/erpCatalog';

export default function CheckoutThanks() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session') || '';

  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'working' | 'done' | 'error'>('working');

  useEffect(() => {
    if (!sessionId) {
      setError('Missing checkout session.');
      setPhase('error');
      return;
    }

    let cancelled = false;
    let attempts = 0;

    async function run() {
      try {
        // Mock path: payment already completed in MockPaymentModal before navigation.
        const current = await fetchCheckoutSession(sessionId);
        if (cancelled) return;

        if (current.status === 'paid') {
          setSession(current);
          clearCartItem();
          setPhase('done');
          return;
        }
        if (
          current.status === 'failed' ||
          current.status === 'cancelled' ||
          current.status === 'expired'
        ) {
          setError(`Payment ${current.status}. Stock hold was released.`);
          setPhase('error');
          return;
        }

        // Real PhonePe sandbox/live: verify via status API
        while (!cancelled && attempts < 30) {
          attempts += 1;
          const result = await confirmPhonePeCheckout(sessionId);
          if (cancelled) return;

          if (!result.pending && result.session) {
            setSession(result.session);
            clearCartItem();
            setPhase('done');
            return;
          }

          const latest = await fetchCheckoutSession(sessionId);
          if (cancelled) return;
          setSession(latest);
          if (latest.status === 'paid') {
            clearCartItem();
            setPhase('done');
            return;
          }
          if (
            latest.status === 'failed' ||
            latest.status === 'cancelled' ||
            latest.status === 'expired'
          ) {
            setError(`Payment ${latest.status}. Stock hold was released.`);
            setPhase('error');
            return;
          }

          await new Promise((r) => setTimeout(r, 2000));
        }

        if (!cancelled) {
          setError(
            'Still waiting for PhonePe confirmation. Complete payment on the PhonePe page, then refresh.',
          );
          setPhase('error');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not confirm payment');
          setPhase('error');
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (phase === 'working') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-domine text-2xl text-[#032C5E] mb-3">Confirming payment…</h1>
        <p className="text-sm text-gray-500">Verifying payment and creating your store bill.</p>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-domine text-2xl text-[#032C5E] mb-3">Payment not completed</h1>
        <p className="text-sm text-red-600 mb-8">{error}</p>
        <Link
          href="/jewellery"
          className="inline-flex bg-[#032C5E] text-white text-xs font-bold uppercase tracking-widest px-8 py-3 rounded-full"
        >
          Back to jewellery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-[11px] uppercase tracking-widest text-emerald-600 mb-3">Payment successful</p>
      <h1 className="font-domine text-3xl text-[#032C5E] font-bold mb-4">Thank you</h1>
      <p className="text-sm text-gray-600 mb-8">
        Your order for tag <span className="font-medium text-[#222]">{session?.tag_number}</span> is
        confirmed. Please collect from the store.
      </p>

      <div className="border border-gray-100 rounded-lg p-5 text-left bg-[#fafafa] mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Amount paid</span>
          <span className="font-bold">{formatDisplayPrice(session?.amount)}</span>
        </div>
        {session?.erp_bill_number ? (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Store bill</span>
            <span className="font-medium">{session.erp_bill_number}</span>
          </div>
        ) : null}
        {session?.customer_name ? (
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">Customer</span>
            <span className="font-medium">{session.customer_name}</span>
          </div>
        ) : null}
      </div>

      <Link
        href="/jewellery"
        className="inline-flex bg-[#f1592a] text-white text-xs font-bold uppercase tracking-widest px-8 py-3 rounded-full"
      >
        Continue shopping
      </Link>
    </div>
  );
}
