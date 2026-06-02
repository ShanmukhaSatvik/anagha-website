'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const FAQ_DATA = [
  {
    section: 'About Anagha',
    items: [
      {
        q: 'Who are we? What makes Anagha different?',
        a: "Anagha is different because we offer you an exquisite range of fine jewellery designs from India and a unique and hassle-free online shopping experience that you are sure to enjoy.",
      },
      {
        q: 'Where is Anagha located?',
        a: "We are located in Hyderabad, Telangana. We design and manufacture all our jewellery in India.",
      },
      {
        q: 'Where is your jewellery made?',
        a: "All our jewellery is manufactured in India.",
      },
      {
        q: 'Do you offer any additional discounts?',
        a: "No, we do not offer any additional discounts. Our all-inclusive MRP is lower than most stores. Our products are offered directly from the manufacturer with no overheads like rent or inventory costs. We pass on this benefit to all our customers by way of honest and competitive prices.",
      },
      {
        q: 'Do you sell gift cards or gift certificates?',
        a: "You may contact our Customer Delight team at 18004190066 or an@anagha.com and they will help you with a customized gift card.",
      },
    ],
  },
  {
    section: 'Delivery',
    items: [
      {
        q: 'How much does it cost to have a Anagha product delivered to my home?',
        a: "Anagha provides free shipping on all items within India.",
      },
      {
        q: 'What is the estimated delivery time?',
        a: "For orders within India, our delivery date depends on the product selected and the shipping address. Same Day Shipping products are delivered within 2 to 10 business days. Made-to-Order products take 2 to 19 business days (excluding Sundays and festive holidays).",
      },
      {
        q: 'How will the delivery be done?',
        a: "We process national delivery only through reputed insured couriers. Please check if we deliver to your pincode.",
      },
      {
        q: 'How safe is my product?',
        a: "Your jewellery is shipped in durable, tamper-proof packing. It is fully insured until it reaches your doorstep, and we only work with reputed courier services. Please do not accept any package that has been tampered with.",
      },
      {
        q: 'Can I change my shipping address after placing an order?',
        a: "Until your order is ready to be shipped, you can change the shipping address. Please contact our Customer Delight team at 18004190066 for assistance.",
      },
    ],
  },
  {
    section: 'Returns and Exchanges',
    items: [
      {
        q: 'What is your Money Back Policy?',
        a: "Our 30-day No Questions Asked Money Back Policy gives you time to make sure your purchase is perfect. If you need to return it for any reason, we will happily provide a full refund or exchange within 30 days of delivery. Applicable for orders within India only.",
      },
      {
        q: 'Will you withhold shipping charges when I return within 30 days?',
        a: "No. When we said we will return the money you paid in full, we meant it.",
      },
      {
        q: 'Will I have to pay for shipping the product back?',
        a: "We offer FREE Return Shipping. You will receive complimentary return shipping on all resizings, exchanges, or refunds for all products within the 30-day money back policy. Applicable for orders within India only.",
      },
      {
        q: 'What is your Exchange and Buy-back Policy?',
        a: "We offer a Lifetime Exchange and Buy-back on all purchases made from Anagha, within India. The product along with the original product certificate can be returned for buy-back or exchanged based on its current market value, with deductions towards making charges.",
      },
      {
        q: 'Does Anagha deliver internationally?',
        a: "Currently, we take orders for delivery only within India.",
      },
    ],
  },
  {
    section: 'Jewellery',
    items: [
      {
        q: 'Can I commission a custom design?',
        a: "Please call our Customer Delight team and they will be able to help you. You can customize the gold karatage and the diamond colour-clarity combination online as per your choice.",
      },
      {
        q: 'Do pendants come with the chain?',
        a: "Yes, we have a selection of chains. After selecting a pendant, click on Buy Now. In the shopping bag, you will find an option to browse for chains. Note: the price near the pendant is for the pendant only.",
      },
      {
        q: 'Does Anagha sell Conflict Free diamonds?',
        a: "Absolutely. Anagha uses only conflict-free diamonds obtained from legitimate sources certified through the worldwide recognized Kimberley Process Certification Scheme (KPCS).",
      },
      {
        q: 'Is my jewellery authentic and certified?',
        a: "All diamond and gemstone jewellery from Anagha is certified by SGL, IGI, GIA or HKD. All gold jewellery is BIS hallmarked, some of the most respected and trusted grading bodies in the world.",
      },
      {
        q: 'Are your prices lower than a local jewellery store?',
        a: "Absolutely! Our products are offered with no overheads like rent and inventory costs, so we happily pass on the benefit to our customers.",
      },
    ],
  },
  {
    section: 'Making an Online Purchase',
    items: [
      {
        q: 'How should I place an order online?',
        a: "Select your jewellery and add it to your Shopping Bag, then click Secure Checkout. Enter your Email and Name, followed by shipping details, then select your Mode of Payment and Place the order. You will receive an order confirmation email.",
      },
      {
        q: 'Can I order by phone?',
        a: "Yes. You can browse through our designs on the website and order your selected design by phone. Our Customer Delight representative will help you place the order. Contact them at 18004190066.",
      },
      {
        q: 'Will I get an order confirmation?',
        a: "Yes. Your order confirmation will be sent to the email you provide while placing your order.",
      },
      {
        q: 'How do I cancel an order?',
        a: "Please contact our Customer Delight team at 18004190066 to cancel your orders.",
      },
      {
        q: 'How do I track my order after it has been shipped?',
        a: "Please log in to your Anagha account and track your order in the Order History section of your account.",
      },
    ],
  },
  {
    section: 'Payments',
    items: [
      {
        q: 'How do I make a payment for a Anagha purchase?',
        a: "Anagha offers multiple payment methods: Credit Card, Debit Card, Net Banking, UPI, and Cash on Delivery. All card details are protected using SSL encryption technology.",
      },
      {
        q: 'Are there any hidden costs?',
        a: "There are no hidden costs or additional shipping charges. The total price mentioned on the product page is the final price. What you see is what you pay.",
      },
      {
        q: 'Are prices on anagha.com subject to change?',
        a: "Prices on anagha.com are subject to change without notice. Please expect to be charged the price listed on the day of purchase.",
      },
      {
        q: 'How do I pay using a Credit or Debit card and is it safe?',
        a: "We accept VISA and MasterCard. Enter your 16-digit card number and 3-digit CVV code. All card details remain confidential and are protected by SSL encryption technology.",
      },
      {
        q: 'How long will it take to get refunds?',
        a: "The refunded amount will be directly credited to your bank account after we receive your jewellery. Please contact our Customer Delight team with your bank account and IFSC code.",
      },
    ],
  },
  {
    section: 'After Purchase',
    items: [
      {
        q: 'What happens if the ring I bought does not fit?',
        a: "We offer complimentary ring resizing within 30 days from the shipping date. If the design does not permit resizing, we will replace the ring free of cost with a new ring of the correct size. This is applicable for orders within India only.",
      },
      {
        q: 'What if there is a problem with my purchase?',
        a: "If there are any problems with the quality of workmanship, we will repair it free of charge and pay the shipping too. If you are not satisfied, you can return the product within 30 days under our No Questions Asked Money Back Policy.",
      },
      {
        q: 'Do you match prices if an item goes down in price later?',
        a: "All sale prices are final and Anagha does not price match. All our pricing is calculated using current precious metal and gem prices to give you the best possible value.",
      },
      {
        q: 'Can I take a ring to my local jeweler to have it resized?',
        a: "We do not recommend it. We cannot accept returns of items that have been modified by someone else. Such modifications also void the 30-day money back and lifetime exchange policy.",
      },
      {
        q: 'What happens if I damage a piece?',
        a: "We will repair it for you for a very reasonable fee plus shipping. We want you to enjoy your piece, not have it sitting in a box!",
      },
    ],
  },
  {
    section: 'Policies',
    items: [
      {
        q: '30-Day Money Back Policy',
        a: "Our 30-day No Questions Asked Money Back Policy gives you time to make sure your purchase is perfect. If you need to return it, we will provide a full refund or exchange within 30 days of delivery with FREE return shipping. Applicable for orders within India only. Not applicable on coins.",
      },
      {
        q: 'Lifetime Exchange and Buy-Back Policy',
        a: "We offer a Lifetime Exchange and Buy-Back on all purchases from Anagha, within India. The product along with the original certificate can be returned or exchanged for its current market value, with deductions towards making charges.",
      },
      {
        q: 'Free Shipping Policy',
        a: "Anagha provides free delivery and shipping on all items within India. Same Day Shipping products are delivered within 2 to 10 business days; Made-to-Order products within 2 to 19 business days (excluding Sundays and festive holidays).",
      },
      {
        q: 'Transit Insurance',
        a: "All goods will be fully insured by Anagha until they reach you, so your purchase is 100% safe.",
      },
      {
        q: '100% Refund Guarantee',
        a: "Our 30-day No Questions Asked Money Back Policy gives you time to make sure your purchase is perfect. If you need to return it, we will provide a 100% full refund or exchange and will also pay for the shipping to and fro. Applicable for orders within India only.",
      },
    ],
  },
  {
    section: 'Solitaires',
    items: [
      {
        q: 'What is your return policy for solitaires?',
        a: "For purchases within India, we have a 30-Day No Questions Asked Money Back Policy. If you feel the need to return your solitaire, we will provide a full refund or exchange within 30 days, subject to a value limit of Rs. 5,00,000.",
      },
      {
        q: 'Are your solitaires certified?',
        a: "Yes, all our solitaires are certified by renowned institutions like GIA (Gemological Institute of America) and IGI (International Gemological Institute), ensuring authenticity and quality.",
      },
      {
        q: 'Does Anagha use Conflict Free diamonds?',
        a: "Yes. We source diamonds ethically from legitimate sources certified through the Kimberley Process Certification Scheme (KPCS), ensuring they are conflict-free and responsibly sourced.",
      },
      {
        q: 'How do I return a solitaire?',
        a: "Contact us via mail, phone or chat. We will courier a tamper-proof package to you. Secure your solitaire in it with the original packing and certificate. We will arrange pickup and issue a refund once we receive the product. Applicable for orders within India only.",
      },
      {
        q: 'Do you offer a Buy-Back Policy on solitaires?',
        a: "Yes, we offer a Lifetime Buy Back Policy on Solitaires wherein you may sell your solitaire back to us for 80% of its current market value, subject to a value limit of Rs. 5,00,000.",
      },
    ],
  },
  {
    section: 'Gift Card',
    items: [
      {
        q: 'What are the terms and conditions of the Anagha Gift Card?',
        a: "Gift cards are valid for 6 months from the date of purchase. Multiple Gift Cards can be used in a single transaction and combined with other payment types. For returns, money will be credited back to the gift card. Gift cards cannot be replaced, refunded or exchanged for cash.",
      },
      {
        q: 'How do I redeem a Gift Card?',
        a: "To redeem your gift card on anagha.com, use the Gift Card option on the payment page and enter the card number and card pin while placing your order. Any balance left can be reused within the validity period.",
      },
      {
        q: 'Can I use multiple Gift Cards in one order?',
        a: "Yes. Multiple Gift Cards can be used in a single transaction. You may also combine Gift Card(s) with any other payment type.",
      },
      {
        q: 'Can I use BluePoints or BlueCredits to purchase a Gift Card?',
        a: "No. BluePoints and BlueCredits cannot be used to purchase gift cards.",
      },
      {
        q: 'What happens if my Gift Card is lost or stolen?',
        a: "Anagha is not responsible if the gift card is lost, stolen or used without permission. The gift cards cannot be replaced, refunded or exchanged for cash.",
      },
    ],
  },
  {
    section: 'Big Gold Upgrade',
    items: [
      {
        q: "What is the Big Gold Upgrade?",
        a: "The Big Gold Upgrade is an offer by Anagha where you may get an instant 1% benefit over the current market gold rate on all purities by exchanging your old gold.",
      },
      {
        q: 'Where can I avail the Big Gold Upgrade?',
        a: "You can avail it across our stores nationwide.",
      },
      {
        q: 'What qualifies as Old Gold jewellery in the Big Gold Upgrade?',
        a: "Your Old Gold must be plain gold jewellery, biscuits, bars, or coins. For diamond or gemstone-studded jewellery, the stones will be detached and handed back to you before melting.",
      },
      {
        q: 'What is the process to avail the Big Gold Upgrade?',
        a: "Visit a store with your Old Gold. The gold purity will be assessed using our Karatmeters. Once all parties agree on purity, weight and valuation, the offered value will be credited to your Anagha account as Blue Credits.",
      },
      {
        q: 'Can I return any product bought with Big Gold Upgrade?',
        a: "Yes. Any product bought with the Big Gold Upgrade is eligible for Lifetime Exchange, Buyback and 30-Day Free Returns as per Anagha standard terms.",
      },
    ],
  },
  {
    section: 'Gold Reserve Plan',
    items: [
      {
        q: 'What is the Gold Reserve Plan?',
        a: "Under the Gold Reserve Plan, you pay a fixed monthly installment and accumulate Reserved Gold Units. On maturity, the total Reserved Gold Units are converted into a Primary Voucher based on the Gold Rate on that date, usable for jewellery purchases.",
      },
      {
        q: 'Is the Gold Reserve Plan same as an EMI?',
        a: "No. The Gold Reserve Plan is a monthly installment scheme to accumulate Reserved Gold Units that convert into a voucher at maturity. It is not a loan or EMI facility.",
      },
      {
        q: 'How do I enroll for the Gold Reserve Plan?',
        a: "You can enroll at any of our stores or online. Click on 10+1 Monthly Plan, select the Gold Reserve Plan, enter the monthly installment amount (minimum Rs. 2,000), fill in personal and nominee details, choose a payment mode and complete the payment.",
      },
      {
        q: 'How can I redeem my Gold Reserve Plan?',
        a: "Your plan auto-redeems on the Maturity Date and your Primary Voucher is issued (along with a Special Benefit Voucher if eligible). For early redemption, visit a company store or contact Customer Support at 18004190066.",
      },
      {
        q: 'Will I get Physical Gold when I redeem my Gold Reserve Plan?',
        a: "No physical gold is provided. Your Reserved Gold Units convert into a voucher at the Gold Rate on the Maturity Date, usable for eligible jewellery purchases (not Coins or Solitaires).",
      },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-2 py-[5px] text-left"
      >
        <span className="shrink-0 text-[#4a4a4a] font-light text-[18px] leading-[1.2] w-5">
          {open ? '\u2212' : '+'}
        </span>
        <span className={`text-[13px] leading-snug ${open ? 'text-[#1a73e8]' : 'text-[#222]'}`}>
          {q}
        </span>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="pl-7 pb-3 text-[13px] text-[#4a4a4a] leading-relaxed">
            {a}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-[#f5f5f5] min-h-screen font-sans">

        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-6 pb-2">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#f1592a] transition-colors">Home</Link>
            {' '}/ <span className="text-gray-600">Frequently Asked Questions</span>
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 lg:gap-16 items-start">

            {/* LEFT: Title */}
            <div className="lg:sticky lg:top-28 flex flex-col items-start pt-8">
              <h1 className="font-domine font-bold text-[38px] md:text-[46px] lg:text-[50px] leading-[1.1] text-[#032C5E] mb-8">
                Frequently<br />Asked<br />Questions
              </h1>
              <div className="mt-2">
                <img
                  src="/images/footer/faq.webp"
                  alt="FAQ illustration"
                  className="h-[140px] w-auto object-contain"
                />
              </div>
            </div>

            {/* RIGHT: Accordion */}
            <div className="pt-8 space-y-0">
              {FAQ_DATA.map((section, si) => (
                <div key={si} className="mb-7">
                  <h2 className="text-[#f1592a] font-semibold text-[13px] mb-2 font-sans">
                    {section.section}
                  </h2>
                  <div>
                    {section.items.map((item, ii) => (
                      <AccordionItem key={ii} q={item.q} a={item.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
