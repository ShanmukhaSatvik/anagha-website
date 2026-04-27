import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Testimonials | Sri Sresta',
  description: 'Read what our customers have to say about their experience with Sri Sresta.',
};

const REVIEWS = [
  {
    name: 'Akanksha Khanna, 27',
    text: 'Delighted with my engagement ring from Sri Sresta! It’s my dream ring, fits perfectly and is stunning to look at. Thanks, Sri Sresta, for helping us find the perfect symbol of love!',
    img: '/images/testimonials/t1.png',
  },
  {
    name: 'Diksha Singh, 29',
    text: 'I was worried about finding good quality fine jewellery pieces online, but Sri Sresta’s customer service gave me full assurance and the delivery was super quick. Their jewellery is certified.',
    img: '/images/testimonials/t2.png',
  },
  {
    name: 'Nutan Mishra, 33',
    text: 'I got a Nazariya for my baby boy from Sri Sresta. It’s so cute seeing it on my little one’s wrist, and it gives me a sense of security knowing it’s there. Thanks, Sri Sresta, for making such lovely pieces!',
    img: '/images/testimonials/t3.png',
  },
  {
    name: 'Divya Mishra, 26',
    text: 'On Valentine’s Day, my husband gifted me a necklace from Sri Sresta, and I haven’t taken it off ever since. Everyone asks me where it’s from, and I just LOVE how nice it looks on me.',
    img: '/images/testimonials/t4.png',
  },
  {
    name: 'Anuska Ananya, 24',
    text: 'Sri Sresta is my go-to place for jewellery. I love that I can wear their jewellery to work, dates, parties and brunches; it goes with everything and makes my outfits look stylish and trendy.',
    img: '/images/testimonials/t6.png',
  },
  {
    name: 'Priya Singh, 34',
    text: 'I had trouble finding jewellery that suited my minimalist style, but Sri Sresta’s sleek and elegant designs were exactly what I was looking for. They have pieces for every style and occasion.',
    img: '/images/testimonials/t5.png',
  },
  {
    name: 'Avni Sharma, 27',
    text: 'Me and my friends love Sri Sresta’s unique designs, especially their enamel jewellery. I love how their enamel pieces add a pop of colour to my outfits. Their jewellery is stylish, modern.',
    img: '/images/testimonials/t7.png',
  },
  {
    name: 'Sonaalee Semwal, 28',
    text: 'I bought a bracelet from Sri Sresta as a birthday gift from me to me. I love how versatile it is. If you want to buy yourself a gift, Sri Sresta is the place to go!',
    img: '/images/testimonials/t8.png',
  }
];

export default function TestimonialsPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-[#f5f5f5] min-h-screen font-sans">
        
        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-6 pb-2">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#f1592a] transition-colors">Home</Link>
            {' '}/ <span className="text-gray-600">Testimonials</span>
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 lg:gap-16 items-start">
            
            {/* LEFT: Title + Image */}
            <div className="lg:sticky lg:top-28 flex flex-col items-start pt-8">
              <h1 className="font-domine font-bold text-[38px] md:text-[46px] lg:text-[50px] leading-[1.1] text-[#032C5E] mb-8">
                Testimonials
              </h1>
              <div className="mt-2">
                <img
                  src="/images/footer/testimonial.webp"
                  alt="Testimonials illustration"
                  className="h-[140px] w-auto object-contain"
                />
              </div>
            </div>

            {/* RIGHT: Content */}
            <div className="pt-8">
              <div className="grid grid-cols-1 gap-6">
                {REVIEWS.map((review, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left transition-shadow hover:shadow-md gap-6"
                  >
                    <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-[3px] border-[#ffeff3]">
                      <img 
                        src={review.img} 
                        alt={review.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="text-[#f1592a] font-semibold text-[15px] mb-3">{review.name}</h4>
                      <p className="text-gray-600 text-[14px] leading-relaxed italic relative inline-block">
                        <span className="text-[#e29db1] text-2xl absolute -top-2 -left-3">"</span>
                        {review.text}
                        <span className="text-[#e29db1] text-2xl absolute -bottom-4 -right-1">"</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
