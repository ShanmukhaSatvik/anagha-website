export type CheckoutCartItem = {
  tag_number: string;
  name: string;
  display_price?: number | null;
  image_url?: string | null;
  type_slug?: string | null;
};

export type CheckoutSession = {
  id: string;
  status: string;
  tag_number: string;
  amount: number;
  currency: string;
  customer_name?: string | null;
  customer_mobile?: string | null;
  customer_email?: string | null;
  erp_bill_id?: string | null;
  erp_bill_number?: string | null;
  expires_at?: string | null;
  payment_mode?: 'mock' | 'sandbox';
};

export type CheckoutPayment = {
  mode: 'mock' | 'sandbox';
  merchantTransactionId: string;
  redirectUrl?: string;
  mockConfirmUrl?: string;
};

const CART_KEY = 'anagha_checkout_cart_v1';

export function saveCartItem(item: CheckoutCartItem) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(item));
}

export function loadCartItem(): CheckoutCartItem | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutCartItem;
  } catch {
    return null;
  }
}

export function clearCartItem() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_KEY);
}

export async function createCheckoutSession(input: { tag_number: string }) {
  const res = await fetch('/api/checkout/session', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || 'Could not start checkout');
  }
  return body.data as { session: CheckoutSession; payment: CheckoutPayment };
}

export async function fetchCheckoutSession(id: string) {
  const res = await fetch(`/api/checkout/session/${encodeURIComponent(id)}`, {
    cache: 'no-store',
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || 'Session not found');
  }
  return body.data as CheckoutSession;
}

export async function mockConfirmCheckout(sessionId: string) {
  const res = await fetch('/api/checkout/mock-confirm', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || 'Mock payment failed');
  }
  return body.data as CheckoutSession;
}

/** Release ERP hold after sandbox Failure (or user abort). */
export async function cancelCheckoutSession(sessionId: string) {
  const res = await fetch(`/api/checkout/session/${encodeURIComponent(sessionId)}/cancel`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || 'Could not cancel checkout');
  }
  return body.data as CheckoutSession;
}

/** After real PhonePe redirect — asks BFF to verify status + complete ERP bill. */
export async function confirmPhonePeCheckout(sessionId: string) {
  const res = await fetch(`/api/checkout/session/${encodeURIComponent(sessionId)}/confirm-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const body = await res.json().catch(() => ({}));
  if (res.status === 202) {
    return { pending: true as const, session: body.data?.session as CheckoutSession | undefined };
  }
  if (!res.ok) {
    throw new Error(body.error || 'Payment confirmation failed');
  }
  return { pending: false as const, session: body.data as CheckoutSession };
}
