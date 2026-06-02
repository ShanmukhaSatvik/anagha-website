import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JewelleryListing from '@/components/JewelleryListing';

export const metadata = {
  title: 'All Jewellery | Anagha',
  description: 'Explore our complete collection of exquisite jewellery.',
};

export default function JewelleryPage() {
  return (
    <>
      <Header />
      <JewelleryListing />
      <Footer />
    </>
  );
}
