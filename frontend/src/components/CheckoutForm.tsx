'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDisplayPrice, type CatalogItem } from '@/lib/erpCatalog';
import {
  createCheckoutSession,
  loadCartItem,
  saveCartItem,
  type CheckoutCartItem,
  type CheckoutSession,
} from '@/lib/checkout';
import { fetchMe, type WebsiteCustomer } from '@/lib/auth';
import MockPaymentModal from '@/components/MockPaymentModal';

async function loadItem(tag: string): Promise<CatalogItem | null> {
  try {
    const res = await fetch(`/api/catalog/items/${encodeURIComponent(tag)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data || null;
  } catch {
    return null;
  }
}

export default function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagFromQuery = (searchParams.get('tag') || '').trim().toUpperCase();

  const [item, setItem] = useState<CatalogItem | null>(null);
  const [customer, setCustomer] = useState<WebsiteCustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mockSession, setMockSession] = useState<CheckoutSession | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      setError(null);

      const me = await fetchMe().catch(() => null);
      if (cancelled) return;
      if (!me) {
        const cart = loadCartItem();
        const tag = tagFromQuery || cart?.tag_number || '';
        const next = tag
          ? `/checkout?tag=${encodeURIComponent(tag)}`
          : '/checkout';
        router.replace(`/account/login?next=${encodeURIComponent(next)}`);
        return;
      }
      setCustomer(me);

      const cart = loadCartItem();
      const tag = tagFromQuery || cart?.tag_number || '';
      if (!tag) {
        setItem(null);
        setLoading(false);
        return;
      }

      const loaded = await loadItem(tag);
      if (cancelled) return;
      if (!loaded) {
        setItem(null);
        setError('This item is no longer available.');
        setLoading(false);
        return;
      }

      const cartItem: CheckoutCartItem = {
        tag_number: loaded.tag_number,
        name: loaded.name,
        display_price: loaded.display_price,
        image_url: loaded.image_url,
        type_slug: loaded.group_slug || loaded.type_slug,
      };
      saveCartItem(cartItem);
      setItem(loaded);
      setLoading(false);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [tagFromQuery, router]);

  async function onPay() {
    if (!item || !customer || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const { session, payment } = await createCheckoutSession({
        tag_number: item.tag_number,
      });

      if (payment.mode === 'mock') {
        setMockSession(session);
        setSubmitting(false);
        return;
      }

      if (payment.redirectUrl) {
        window.location.href = payment.redirectUrl;
        return;
      }

      throw new Error('Payment gateway did not return a redirect URL');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500 text-sm">
        Loading checkout…
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-domine text-2xl text-[#032C5E] mb-3">Your bag is empty</h1>
        <p className="text-sm text-gray-500 mb-8">
          Choose a piece from live inventory to continue.
        </p>
        <Link
          href="/jewellery"
          className="inline-flex bg-[#032C5E] text-white text-xs font-bold uppercase tracking-widest px-8 py-3 rounded-full"
        >
          Browse jewellery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      <h1 className="font-domine text-[28px] text-[#032C5E] font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-5">
          <div className="rounded-xl border border-gray-100 bg-[#fafafa] p-5 space-y-3">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Name</span>
              <span className="font-medium text-[#222] text-right">{customer.name}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Mobile</span>
              <span className="font-medium text-[#222] text-right">{customer.mobile}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-[#222] text-right">{customer.email}</span>
            </div>
          </div>

          {error ? (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={onPay}
            disabled={submitting}
            className="w-full sm:w-auto bg-[#f1592a] hover:bg-[#d94a1f] disabled:opacity-60 text-white font-bold text-[12px] uppercase tracking-widest px-10 py-3.5 rounded-full transition-colors"
          >
            {submitting ? 'Reserving…' : 'Pay securely'}
          </button>
        </div>

        <aside className="lg:col-span-2">
          <div className="border border-gray-100 rounded-lg p-5 bg-[#fafafa]">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-4">Order summary</p>
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-white rounded overflow-hidden flex items-center justify-center shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt="" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-[10px] text-gray-300">No image</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400 uppercase">Tag {item.tag_number}</p>
                <p className="text-sm font-medium text-[#222] leading-snug mt-1">{item.name}</p>
                <p className="text-base font-bold text-[#222] mt-2">
                  {formatDisplayPrice(item.display_price)}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {mockSession ? (
        <MockPaymentModal
          open
          session={mockSession}
          onClose={() => setMockSession(null)}
          onPaid={(paid) => {
            setMockSession(null);
            router.push(`/checkout/thanks?session=${encodeURIComponent(paid.id)}`);
          }}
        />
      ) : null}
    </div>
  );
}
