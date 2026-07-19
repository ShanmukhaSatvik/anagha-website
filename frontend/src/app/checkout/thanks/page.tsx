import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutThanks from '@/components/CheckoutThanks';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Order confirmed | Anagha',
};

export default function CheckoutThanksPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-white min-h-screen font-sans pb-16">
        <Suspense
          fallback={
            <div className="max-w-xl mx-auto px-4 py-20 text-center text-gray-500 text-sm">
              Confirming payment…
            </div>
          }
        >
          <CheckoutThanks />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
