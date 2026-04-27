import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About Us | Sri Sresta',
  description: 'Learn more about Sri Sresta, India\'s leading destination for high-quality fine jewellery.',
};

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-white font-domine min-h-screen py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          {/* Title Section */}
          <div className="flex flex-col items-center justify-center mb-16">
            <h1 className="text-[26px] md:text-[32px] font-domine font-bold tracking-wide text-[#222] uppercase text-center mb-4">
              ABOUT <span className="text-[#f1592a]">US</span>
            </h1>

            {/* Decorative separator: line · dot · line */}
            <div className="flex items-center w-full max-w-[600px] gap-3">
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className="w-[7px] h-[7px] rounded-full bg-[#f1592a] shrink-0"></div>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 text-[#4a4a4a] text-[14px] md:text-[14.5px] leading-[1.85] text-justify">
            
            {/* Left Column */}
            <div className="space-y-6">
              <p>
                <span className="float-left text-[54px] leading-[45px] pr-2 pt-2 text-[#4a4a4a] font-domine">
                  E
                </span>
                stablished in 2011, Sri Sresta is India's leading destination for high-quality fine jewellery with strikingly exquisite designs. As a digital-first, direct-to-consumer (DTC) brand, we are focused on delivering a seamless omnichannel experience and have grown to become India's largest digital-first omni-channel jewellery brand.
              </p>
              
              <p>
                We retail our contemporary lifestyle diamond, gold, platinum and studded jewellery under our flagship brand, Sri Sresta. Our collections are available through our website, www.srisresta.com, our mobile applications on iOS and Google Play Store, and our pan India network of stores bringing together the ease of digital discovery with the warmth of physical retail.
              </p>
              
              <p className="text-[#c0505a]">
                As a design-led brand, we offer over 8,000 unique designs created with a firm focus on craftsmanship, quality, and customer experience. Our award-winning design team pays close attention to detail, creating jewellery that reflects precision and modern elegance. With cutting-edge innovation and advanced technology integrated into our processes, we ensure that brilliance is carried through every stage - from design to delivery.
              </p>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <p>
                Our wide range of offerings includes rings, earrings, necklaces, pendants, solitaires, bangles, bracelets, and chains - catering to diverse customer segments across varied price points and occasions. We design jewellery for women, men, and couples who value distinctive designs, contemporary styles, and often discover brands through digital and social platforms. Every piece is crafted to perfection with utmost care, offering customers the flexibility to customize gold purity and colour, as well as diamond clarity, to suit individual preferences.
              </p>

              <p>
                Our stores have been instrumental in spreading the shine of Sri Sresta and bringing us closer to our customers. With a world-class in-store experience, knowledgeable staff, and the dazzling beauty of fine jewellery, every Sri Sresta boutique is designed to reflect our commitment to excellence.
              </p>

              <p>
                To uphold transparency and trust, we offer certified jewellery from independent establishments such as GSI, IGI, and SGL, ensuring grading authenticity. We also provide a 30-Day Money-Back Guarantee and a Lifetime Exchange Policy, aligning with our ethos of customer centricity.
              </p>
            </div>

          </div>

          {/* ── Brand Story Section ── */}
          <div className="mt-20 md:mt-28">
            {/* Brand Story heading */}
            <h2 className="text-[22px] md:text-[26px] font-domine font-bold text-[#222] text-center mb-12 tracking-wide">
              Brand Story
            </h2>

            <div className="space-y-10 text-[14px] md:text-[14.5px] leading-[1.9] text-justify font-sans">

              {/* Initial Foray */}
              <div>
                <h3 className="font-bold text-[#f1592a] text-[15px] mb-3 font-sans">Initial Foray</h3>
                <p className="text-[#222]">
                  The journey of Sri Sresta started with the launch of 18k gold watches studded with precious stones in 1994. But, it soon grew into a 22K jeweller who presented a stunning range of gold and diamond jewellery. The term Sri Sresta was coined to represent a gold ornament and Sri Sresta's very first state-of-art jewellery factory with a proper <em>karigaar</em> park was set up in Hosur in Tamil Nadu.
                </p>
              </div>

              {/* Timeless Appeal */}
              <div>
                <h3 className="font-bold text-[#f1592a] text-[15px] mb-3 font-sans">Timeless Appeal</h3>
                <p className="text-[#222]">
                  At Sri Sresta, jewellery is not a product but a manifestation of artistry and our exquisite range of jewel pieces strike the perfect balance between traditional charm and contemporary appeal. With designs that capture the beauty and celebration of special occasions in the life of the Indian woman, Sri Sresta aims to be an integral part of her journey. As India's leading wedding jeweller, we understand the varied needs of every regional bride and that has stood as our inspiration behind creating special wedding collections catering to every community across India.
                </p>
              </div>

              {/* Epitomizing Excellence */}
              <div>
                <h3 className="font-bold text-[#f1592a] text-[15px] mb-3 font-sans">Epitomizing Excellence</h3>
                <p className="text-[#222]">
                  At Sri Sresta, we strive to deliver excellence, consistently. We've brought to the market a whole new standard of business ethics and product reliability, in the process bringing about a transformation in which jewellery is bought or sold in India. With innovations like the Karatmeter to check the purity of gold, the brand has won over the customer's hearts. Our constant endeavour is to maintain the highest standard and quality of our gold, diamonds and precious stones used in our jewel pieces. We implement extensive quality checks and only source our diamonds ethically from known, trusted and certified suppliers. At Sri Sresta, we also take great pride in offering an unparalleled retail experience that takes into consideration our customer's unique needs and preferences.
                </p>
              </div>

              {/* Success Secrets */}
              <div>
                <h3 className="font-bold text-[#f1592a] text-[15px] mb-3 font-sans">Success Secrets</h3>
                <p className="text-[#222]">
                  Our understanding of the ethos of the current Indian jewellery market and our constant evolution along with its changing demands and preferences is why Sri Sresta enjoys the distinct honour of being coveted by Indian women. Furthermore, our adherence to stringent standards in terms of quality and strict and uniform guidelines across all 500+ stores have helped in establishing ourselves further as the most trusted jewellery brand in the country.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
