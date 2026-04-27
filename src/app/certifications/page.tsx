import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Our Certifications | Sri Sresta',
  description: 'Learn about our jewellery certification partners and how we ensure authenticity and quality at Sri Sresta.',
};

export default function CertificationsPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-[#f5f5f5] min-h-screen font-sans">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-6 pb-2">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#f1592a] transition-colors">Home</Link>
            {' '}/ <span className="text-gray-600">Our Certifications</span>
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 lg:gap-16 items-start">
            
            {/* LEFT: Title + Image */}
            <div className="lg:sticky lg:top-28 flex flex-col items-start pt-8">
              <h1 className="font-domine font-bold text-[38px] md:text-[46px] lg:text-[50px] leading-[1.1] text-[#032C5E] mb-8">
                Our<br />Certifications
              </h1>
              <div className="mt-2">
                <img
                  src="/images/footer/certification.webp"
                  alt="Our Certifications illustration"
                  className="h-[140px] w-auto object-contain"
                />
              </div>
            </div>

            {/* RIGHT: Content */}
            <div className="pt-8 text-[13px] text-[#222] leading-relaxed space-y-10">
              
              <div>
                <h2 className="text-[#f1592a] font-semibold text-[15px] mb-3 uppercase tracking-wide">The Importance of Certification</h2>
                <div className="space-y-4">
                  <p>The value of a precious stone is determined by its gemological makeup, natural rarity and finished quality. Diamonds and gemstones of similar appearance can have important differences in value. Even experts need powerful analytic tools to detect synthetics, treatments and enhancement processes. A Certificate clearly discloses the details of any item it accompanies, providing confidence for both buyer and seller.</p>
                  <p>Gemstones should only change hands when accompanied by a certificate attesting to quality. Regardless of location or marketplace, an authentic Laboratory Report is the common language of trust and confidence in the gemological world, and should be considered an essential part of any transaction. We take this responsibility very seriously.</p>
                </div>
              </div>

              <div>
                <h2 className="text-[#f1592a] font-semibold text-[15px] mb-6 uppercase tracking-wide">Our Jewellery Certification Partners</h2>
                
                <div className="space-y-8">
                  {/* SGL */}
                  <div>
                    <h3 className="font-semibold text-[#032C5E] text-[14px] mb-2">Solitaire Gemmological Laboratories Ltd. (SGL)</h3>
                    <p className="mb-2">is an independent international gem testing laboratory. Trusted by jewellers and consumers alike, SGL Reports represent the highest standard of reliability, consistency and integrity. Committed to high certification standards, they serve the interests of the gems and jewellery industry and support gemmological research worldwide through their centers in London, Mumbai (Bombay), Bangalore, Chennai, Hyderabad, Thrissur, Coimbatore, Pune and Jaipur. An SGL Certificate offers unmatched assurance of a diamond's quality and authenticity.</p>
                    <p>Visit their website for more details: <a href="http://www.sgl-labs.com" target="_blank" rel="noopener noreferrer" className="text-[#1a73e8] hover:underline">www.sgl-labs.com</a></p>
                  </div>

                  {/* IGI */}
                  <div>
                    <h3 className="font-semibold text-[#032C5E] text-[14px] mb-2">International Gemological Institute (IGI)</h3>
                    <div className="space-y-3">
                      <p>It is the result of continuous research, support and synergy with professionals and consumers alike. Around the world, IGI certificates bring confidence when buying or selling diamonds, gemstones and jewellery.</p>
                      <p>Total commitment to understanding consumer concerns has motivated IGI to develop comprehensive analysis and clear documentation for consumers. This empowers jewellery buyers to focus on finding precisely what they want, with full assurance in the integrity and quality of the IGI certification.</p>
                      <p>IGI is the largest organization of its kind, with offices in Antwerp, New York, Hong Kong, Mumbai, Bangkok, Tokyo, Dubai, Tel Aviv, Cavalese, Toronto, Los Angeles, Kolkata, New Delhi, Thrissur, Surat, Chennai and Shanghai . The IGI School of Gemology operates from Antwerp, Mumbai, Dubai and Cavalese, offering a variety of courses designed for professionals and consumer enthusiasts alike.</p>
                      <p>A certificate from IGI represents the all-important 5th C that no one should be without: Confidence. As the world's largest independent gem certification and appraisal institute for diamonds, colored gemstones and jewellery, IGI is a standard of excellence for industry professionals and consumers around the globe.</p>
                      <p>Visit their website for more details: <a href="http://www.igiworldwide.com" target="_blank" rel="noopener noreferrer" className="text-[#1a73e8] hover:underline">www.igiworldwide.com</a></p>
                    </div>
                  </div>

                  {/* HKD */}
                  <div>
                    <h3 className="font-semibold text-[#032C5E] text-[14px] mb-2">HKD Diamond Laboratories, Canada</h3>
                    <div className="space-y-3">
                      <p>HKD Diamond Laboratories Canada was established in 1990 to provide secure and reliable gemological services to jewellery manufacturers, retailers, and wholesalers. Over the past 15 years the company has become an international leader in diamond reports, jewellery dossiers, and branded jewellery reports. Staffed by GIA trained gemologists and other professionally accredited personnel, its three state-of-the art laboratories are conveniently located in the heart of the gemstone and jewellery districts of Toronto-Canada, Mumbai-India, and Bangkok-Thailand.</p>
                      <p>Clear and concise, HKD's diamond and gem reports are continually adapted to the ever-changing jewellery marketplace. Professionally produced using advanced digital imaging, the company's lab reports are sold to the trade, but produced in a user-friendly format that caters to the final consumer. In addition, HKD specializes in branded reports for jewellery designers wishing to supply a "Certificate of Authenticity" along with their fine jewellery. Digital diamond plots, logos, SealSafe Holograms, and unique identification numbers are among the security measures taken to prevent tampering of these critical documents.</p>
                      <p>Visit their website for more details: <a href="http://www.hkdlab.ca" target="_blank" rel="noopener noreferrer" className="text-[#1a73e8] hover:underline">www.hkdlab.ca</a></p>
                    </div>
                  </div>

                  {/* GIA */}
                  <div>
                    <h3 className="font-semibold text-[#032C5E] text-[14px] mb-2">GIA</h3>
                    <div className="space-y-3">
                      <p>The Gemological Institute of America commonly abbreviated as GIA was established in 1931 and has been one of the leading authorities on diamonds, gemstones as well as pearls. Since its inception, it has stood to protect the interests of buyers and sellers across the world by ensuring standards to authenticate a gemstone's quality. The inventors of the 4C's - cut, clarity, colour and carat weight, they established the parameters that help choose quality diamonds, and today, these parameters are the standard in case of gem trade. It has also, since time immemorial, remained a leading source of gem and jewellery information for trading purposes as well as for the public and other worldwide media outlets. The 4C's - Cut, clarity, colour and Carat weight represent the key characteristics that help determine the quality and the value of a diamond. At the GIA laboratories, a comprehensive report helps analyse the quality of the diamond. With an increase in the number of consumers looking for authentication on the diamond purchased, GIA has ensured that the certification it offers provides accurate details to the consumer.</p>
                      <p>Aside of this, the GIA also offers diploma and certificate programs with comprehensive studies in the fields of gemology, diamonds, coloured stones, jewellery, Jewellery Design &amp; Technology, Jewellery design and CAD/CAM for jewellery, making them pioneers in the field of gemstones and diamonds.</p>
                      <p>Visit their website for more details: <a href="http://www.giaindia.in" target="_blank" rel="noopener noreferrer" className="text-[#1a73e8] hover:underline">www.giaindia.in</a></p>
                    </div>
                  </div>

                  {/* BIS hallmark */}
                  <div>
                    <h3 className="font-semibold text-[#032C5E] text-[14px] mb-2">BIS hallmark</h3>
                    <div className="space-y-3">
                      <p>The BIS hallmark is a system that provides certification of gold as well as silver jewellery that indicates the purity of the metal. This certification authenticates that a piece of gold jewellery purchased, conforms to the standards as laid by the Bureau of Indian Standards which is the national standards organization in India.</p>
                      <p>This hallmarking of gold jewellery was established in April 2000. The hallmark itself consists of a BIS logo, a 3 digit number that indicates the gold purity, the logo of the assaying center along with the logo or the code of the jeweller and the code that indicates the hallmarking date.</p>
                      <p>The BIS hallmarking has a high reputation among the jewellery trading industry in India, and is widely accepted by the consumers.</p>
                      <p>Visit their website for more details: <a href="http://www.bis.gov.in" target="_blank" rel="noopener noreferrer" className="text-[#1a73e8] hover:underline">www.bis.gov.in</a></p>
                    </div>
                  </div>

                  {/* GSI */}
                  <div>
                    <h3 className="font-semibold text-[#032C5E] text-[14px] mb-2">Gemological Science International (GSI)</h3>
                    <div className="space-y-3">
                      <p>Seeking quality assurance and a sense of trust when purchasing valuable items like fine jewellery has become the norm. The world of jewellery requires strict quality control measures, and certification plays a vital role in ensuring the authenticity and value of the diamonds. This is where the Gemological Science International (GSI) comes in. GSI is one of the leading gemological laboratories globally, offering certification services for diamonds and other precious stones.</p>
                      
                      <p className="font-semibold text-[#222] pt-2">Why should you pick certified fine jewellery?</p>
                      <p>A diamond is a symbol of love, commitment, and investment. It is a precious stone that requires considerable thought; therefore, purchasing one can be a significant responsibility. A large question is whether the creation is worth committing to. Certification is a way of answering the question while ensuring the jewellery's quality, authenticity, and value. A certified diamond or gemstone is graded and evaluated by a gemologist or a gemological laboratory, assuring the customer that they are getting a genuine and high-quality stone. Furthermore, certification provides detailed information about the diamond's characteristics, such as the carat, colour, clarity, and cut. This information enables the customer to make an informed decision when purchasing a diamond and allows them to compare diamonds and gemstones based on the same criteria.</p>

                      <p className="font-semibold text-[#222] pt-2">What is the Gemological Science International (GSI) certification?</p>
                      <p>The Gemological Science International (GSI) is a globally recognised gemological laboratory that provides certification services for diamonds and other precious stones. GSI is an independent organisation headquartered in New York and provides services to customers worldwide.</p>
                      <p>Their wide range of services, including grading, identification, and appraisal of diamonds, coloured stones, and jewellery, is based on the 4 Cs of diamonds: carat, colour, clarity, and cut. Besides a detailed description of the precious stone's characteristics, GSI can detect treatments and enhancements that may affect the diamond's value using advanced technology such as fluorescence imaging and UV light, thus assuring you of the jewellery's standard of purity and trust.</p>

                      <p className="font-semibold text-[#222] pt-2">What sets the GSI certification apart?</p>
                      <p>A critical difference that sets GSI apart is transparency and integrity. An independent organisation that remains unaffiliated from any players in the diamond industry, the certification prides itself on being unbiased and impartial.</p>
                      <p>Another significant difference is the level of detail provided in the grading reports. GSI provides a more comprehensive report with detailed cut, colour, clarity, and fluorescence information. GSI also uses advanced technology to detect treatments and enhancements that may affect the diamond's value. Their grading process is centred on its state-of-the-art proprietary software. This state-of-the-art software reduces the chances of human error by automating the grading process, giving customers the assurance they need when purchasing fine jewellery.</p>

                      <p className="font-semibold text-[#222] pt-2">Should I never purchase jewellery without GSI certification?</p>
                      <p>When purchasing fine jewellery, we always recommend doing your due diligence and seeking reputable certifications from recognised gemological organisations to ensure you get a high-quality product. Suppose you purchase jewellery without GSI certification or any other recognised certification. In that case, there is a risk that the jewellery may not be worth the price you paid or that the quality of the gems may be lower than advertised. You may also need proper certification to insure the piece.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
