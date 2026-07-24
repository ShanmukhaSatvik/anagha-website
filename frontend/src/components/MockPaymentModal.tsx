'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDisplayPrice } from '@/lib/erpCatalog';
import {
  cancelCheckoutSession,
  clearCartItem,
  mockConfirmCheckout,
  type CheckoutSession,
} from '@/lib/checkout';

type Phase = 'processing' | 'choose' | 'completing' | 'success' | 'failed' | 'releasing';

type Props = {
  open: boolean;
  session: CheckoutSession;
  onClose: () => void;
  onPaid: (session: CheckoutSession) => void;
};

export default function MockPaymentModal({ open, session, onClose, onPaid }: Props) {
  const [phase, setPhase] = useState<Phase>('processing');
  const [error, setError] = useState<string | null>(null);
  const [paidSession, setPaidSession] = useState<CheckoutSession | null>(null);
  const settledRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    settledRef.current = false;
    setPhase('processing');
    setError(null);
    setPaidSession(null);
    const t = window.setTimeout(() => setPhase('choose'), 2200);
    return () => window.clearTimeout(t);
  }, [open, session.id]);

  async function releaseHold() {
    if (settledRef.current) return;
    settledRef.current = true;
    try {
      await cancelCheckoutSession(session.id);
    } catch {
      // Best-effort: hold may already be gone
    }
    clearCartItem();
  }

  async function handleClose() {
    if (phase === 'completing' || phase === 'success' || phase === 'releasing') return;
    if (phase === 'failed') {
      onClose();
      return;
    }
    setPhase('releasing');
    await releaseHold();
    onClose();
  }

  async function onSuccess() {
    if (settledRef.current) return;
    settledRef.current = true;
    setPhase('completing');
    setError(null);
    try {
      const paid = await mockConfirmCheckout(session.id);
      clearCartItem();
      setPaidSession(paid);
      setPhase('success');
      window.setTimeout(() => onPaid(paid), 1600);
    } catch (err) {
      settledRef.current = false;
      setError(err instanceof Error ? err.message : 'Could not complete payment');
      setPhase('failed');
    }
  }

  async function onFailure() {
    if (settledRef.current) return;
    setPhase('completing');
    setError(null);
    try {
      await releaseHold();
      setPhase('failed');
      setError('Payment declined (sandbox). Stock hold released.');
    } catch (err) {
      settledRef.current = false;
      setError(err instanceof Error ? err.message : 'Could not cancel payment');
      setPhase('failed');
    }
  }

  if (!open) return null;

  const canClose =
    phase === 'processing' || phase === 'choose' || phase === 'failed';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.button
        type="button"
        aria-label="Close payment"
        className="absolute inset-0 bg-[#032C5E]/45 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => {
          if (canClose) void handleClose();
        }}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Secure payment"
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white text-[#222] shadow-2xl border border-[#032C5E]/10"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      >
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-gray-100 bg-[#fffbfa]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f1592a]">Demo payment</p>
            <p className="text-sm font-semibold tracking-wide text-[#032C5E] font-domine">Anagha</p>
          </div>
          {canClose ? (
            <button
              type="button"
              onClick={() => void handleClose()}
              className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-[#032C5E] transition-colors"
            >
              Close
            </button>
          ) : null}
        </div>

        <div className="px-6 py-8 min-h-[320px] flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {phase === 'processing' || phase === 'completing' || phase === 'releasing' ? (
              <motion.div
                key="processing"
                className="flex w-full flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Fixed stage: flex-centers the coin; motion only moves the coin itself */}
                <div className="relative mb-6 flex h-40 w-full items-center justify-center">
                  <motion.div
                    className="absolute bottom-4 h-2 w-16 rounded-full bg-[#032C5E]/15 blur-[1px]"
                    animate={{
                      scaleX: [1.1, 0.55, 0.95, 0.7, 1],
                      opacity: [0.55, 0.25, 0.45, 0.3, 0.5],
                    }}
                    transition={{ duration: 2.1, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#f8c9b0] bg-gradient-to-br from-[#ffb48a] via-[#f1592a] to-[#c43d12] shadow-[0_12px_32px_rgba(241,89,42,0.35)]"
                    initial={{ y: 0, rotateY: 0, scale: 1 }}
                    animate={{
                      y: [0, -36, 6, -14, 0],
                      rotateY: [0, 360, 720, 1080],
                      scale: [1, 1.06, 0.98, 1.02, 1],
                    }}
                    transition={{ duration: 2.1, ease: 'easeInOut' }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <span className="text-3xl font-bold text-white drop-shadow-sm">₹</span>
                  </motion.div>
                </div>
                <p className="font-domine text-lg font-semibold text-[#032C5E]">
                  {phase === 'releasing'
                    ? 'Releasing hold…'
                    : phase === 'completing'
                      ? 'Finalising with store…'
                      : 'Securing your payment…'}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {formatDisplayPrice(session.amount)} · Tag {session.tag_number}
                </p>
              </motion.div>
            ) : null}

            {phase === 'choose' ? (
              <motion.div
                key="choose"
                className="w-full"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#032C5E]/8">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="text-[#032C5E]"
                  >
                    <path d="M3 10h18M5 10V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2M5 10v8h14v-8M9 14h6" />
                  </svg>
                </div>
                <h2 className="mb-1 font-domine text-xl font-bold text-[#032C5E]">
                  Test bank response
                </h2>
                <p className="mb-2 text-sm text-gray-500">
                  Amount{' '}
                  <span className="font-semibold text-[#222]">
                    {formatDisplayPrice(session.amount)}
                  </span>
                </p>
                <p className="mb-8 text-xs text-gray-400">
                  Demo mode — choose an outcome. No real money is charged.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={onSuccess}
                    className="rounded-full bg-[#032C5E] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#021f42]"
                  >
                    Success
                  </button>
                  <button
                    type="button"
                    onClick={onFailure}
                    className="rounded-full bg-[#f1592a] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#d94a1f]"
                  >
                    Failure
                  </button>
                </div>
              </motion.div>
            ) : null}

            {phase === 'success' ? (
              <motion.div
                key="success"
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-emerald-500"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                >
                  <motion.svg
                    viewBox="0 0 24 24"
                    className="h-10 w-10 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.45, delay: 0.15 }}
                    />
                  </motion.svg>
                </motion.div>
                <h2 className="mb-2 font-domine text-2xl font-bold text-[#032C5E]">
                  Payment successful
                </h2>
                <p className="text-sm text-gray-500">
                  {paidSession?.erp_bill_number
                    ? `Bill ${paidSession.erp_bill_number} created`
                    : 'Creating your store bill…'}
                </p>
              </motion.div>
            ) : null}

            {phase === 'failed' ? (
              <motion.div
                key="failed"
                className="flex w-full flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-[#f1592a] text-3xl text-[#f1592a]">
                  ✕
                </div>
                <h2 className="mb-2 font-domine text-2xl font-bold text-[#032C5E]">Payment failed</h2>
                <p className="mb-8 max-w-xs text-sm text-gray-500">
                  {error || 'Payment was not completed. The item is available again.'}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-[#032C5E] px-8 py-3 text-xs font-bold uppercase tracking-widest text-white"
                >
                  Back to checkout
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="border-t border-gray-100 px-6 py-3 text-center text-[10px] uppercase tracking-widest text-gray-400">
          Mock gateway · Closing releases your stock hold
        </div>
      </motion.div>
    </div>
  );
}
