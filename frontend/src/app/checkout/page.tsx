import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutForm from '@/components/CheckoutForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Checkout | Anagha',
  description: 'Secure checkout for live store inventory.',
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-white min-h-screen font-sans pb-16">
        <Suspense
          fallback={
            <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500 text-sm">
              Loading checkout…
            </div>
          }
        >
          <CheckoutForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
