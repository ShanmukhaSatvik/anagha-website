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
} from '@/lib/checkout';

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
  const [loadingItem, setLoadingItem] = useState(true);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoadingItem(true);
      setError(null);
      const cart = loadCartItem();
      const tag = tagFromQuery || cart?.tag_number || '';
      if (!tag) {
        if (!cancelled) {
          setItem(null);
          setLoadingItem(false);
        }
        return;
      }

      const loaded = await loadItem(tag);
      if (cancelled) return;
      if (!loaded) {
        setItem(null);
        setError('This item is no longer available.');
        setLoadingItem(false);
        return;
      }

      const cartItem: CheckoutCartItem = {
        tag_number: loaded.tag_number,
        name: loaded.name,
        display_price: loaded.display_price,
        image_url: loaded.image_url,
        type_slug: loaded.type_slug,
      };
      saveCartItem(cartItem);
      setItem(loaded);
      setLoadingItem(false);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [tagFromQuery]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!item || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const { session, payment } = await createCheckoutSession({
        tag_number: item.tag_number,
        customer_name: name.trim(),
        customer_mobile: mobile.trim(),
        customer_email: email.trim() || undefined,
      });

      if (payment.mode === 'mock') {
        router.push(`/checkout/thanks?session=${encodeURIComponent(session.id)}&mock=1`);
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

  if (loadingItem) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500 text-sm">
        Loading checkout…
      </div>
    );
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
        <form onSubmit={onSubmit} className="lg:col-span-3 space-y-5">
          <p className="text-[12px] text-gray-500 uppercase tracking-widest">
            Contact details — pickup at store
          </p>

          <label className="block">
            <span className="text-[12px] text-gray-600">Full name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded px-3 py-2.5 text-sm outline-none focus:border-[#032C5E]"
              autoComplete="name"
            />
          </label>

          <label className="block">
            <span className="text-[12px] text-gray-600">Mobile</span>
            <input
              required
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              title="Enter a 10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="mt-1 w-full border border-gray-200 rounded px-3 py-2.5 text-sm outline-none focus:border-[#032C5E]"
              autoComplete="tel"
              placeholder="10-digit mobile"
            />
          </label>

          <label className="block">
            <span className="text-[12px] text-gray-600">Email (optional)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded px-3 py-2.5 text-sm outline-none focus:border-[#032C5E]"
              autoComplete="email"
            />
          </label>

          {error ? (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto bg-[#f1592a] hover:bg-[#d94a1f] disabled:opacity-60 text-white font-bold text-[12px] uppercase tracking-widest px-10 py-3.5 rounded-full transition-colors"
          >
            {submitting ? 'Reserving…' : 'Pay securely'}
          </button>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Paying reserves this tag in store stock. Your ERP customer record is created only after
            successful payment. No shipping address is collected in this release — collect from store.
          </p>
        </form>

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
    </div>
  );
}
