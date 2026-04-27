'use client';
import React from 'react';
import Link from 'next/link';

// Simple SVG Icons
const PhoneIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5 text-[#041d36]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 text-[#041d36]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-5 h-5 text-[#041d36]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// Payment Icons
const MastercardIcon = () => (
  <svg className="h-6 w-auto" viewBox="0 0 32 20" fill="none">
    <rect width="32" height="20" rx="2" fill="#E5E7EB" />
    <circle cx="11.5" cy="10" r="6" fill="#EB001B" />
    <circle cx="20.5" cy="10" r="6" fill="#F79E1B" />
    <path d="M16 14.5a5.98 5.98 0 0 1-2.5-4.5A5.98 5.98 0 0 1 16 5.5a5.98 5.98 0 0 1 2.5 4.5 5.98 5.98 0 0 1-2.5 4.5z" fill="#FF5F00" />
  </svg>
);

const VisaIcon = () => (
  <svg className="h-6 w-auto" viewBox="0 0 32 20" fill="none">
    <rect width="32" height="20" rx="2" fill="#E5E7EB" />
    <path d="M11.6 13.8l1.6-9.6h2.5l-1.6 9.6h-2.5zm10.7-9.4c-.4-.1-1.1-.3-2-.3-2.2 0-3.8 1.2-3.8 2.8 0 1.2 1.1 1.9 1.9 2.3.8.4 1.1.7 1.1 1.1 0 .6-.7.9-1.4.9-.8 0-1.2-.1-1.9-.4l-.3-.1-.3 1.7c.5.2 1.3.4 2.1.4 2.4 0 3.9-1.2 4-2.9 0-1-.7-1.7-1.8-2.2-.8-.4-1.2-.6-1.2-1 0-.3.4-.7 1.3-.7.7 0 1.2.1 1.6.3l.2.1.2-1.7zm-9.3 6.3l-1-4.8c-.1-.6-.5-.9-1-.9h-3.6l-.1.3c.7.2 1.5.4 2 .7.3.2.4.5.5.9l1.6 7h2.6l4-9.6h-2.6l-2.4 6.4h-.1z" fill="#1434CB" />
  </svg>
);

const AmexIcon = () => (
  <svg className="h-6 w-auto" viewBox="0 0 32 20" fill="none">
    <rect width="32" height="20" rx="2" fill="#E5E7EB" />
    <path d="M22.7 12.8v1.3H15v-8.4h7.5v1.3H17v2.1h4.9v1.2H17v2.4h5.7zM11.5 5.8H9l-2.4 5.9-2.3-5.9H1.8l3.4 8.4H7.5l1.6-4.2 1.6 4.2h2.2l-3.5-8.4z" fill="#2E77BC" />
  </svg>
);


export default function Footer() {
  return (
    <footer className="bg-[#041d36] text-white pt-16 pb-8 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 xl:px-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          
          {/* Column 1 */}
          <div>
            <h3 className="font-bold text-white mb-5 text-[13px] tracking-wider font-display uppercase">CUSTOMER DELIGHT</h3>
            <ul className="space-y-3 text-[13px] text-gray-300">
              <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li className="flex items-center gap-2">
                <PhoneIcon />
                <span>1800-419-0066</span>
              </li>
              <li className="flex items-center gap-2">
                <MailIcon />
                <span>cs@srisresta.com</span>
              </li>
              <li className="text-gray-400 mt-1">
                (9 am-10 pm, 7 days a week)
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-bold text-white mb-5 text-[13px] tracking-wider font-display uppercase">POLICIES</h3>
            <ul className="space-y-3 text-[13px] text-gray-300">
              <li><Link href="/shipping-returns" className="hover:text-white transition-colors">30-Day Returns</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/fraud-warning" className="hover:text-white transition-colors">Fraud Warning Disclaimer</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-bold text-white mb-5 text-[13px] tracking-wider font-display uppercase">ABOUT US</h3>
            <ul className="space-y-3 mb-10 text-[13px] text-gray-300">
              <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>

            <h3 className="font-bold text-white mb-5 text-[13px] tracking-wider font-display uppercase">SHOP WITH CONFIDENCE</h3>
            <ul className="space-y-3 text-[13px] text-gray-300">
              <li><Link href="/certifications" className="hover:text-white transition-colors">Our Certifications</Link></li>
              <li><Link href="/testimonials" className="hover:text-white transition-colors">Testimonials</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-bold text-white mb-5 text-[13px] tracking-wider font-display uppercase">SUBSCRIBE TO OUR NEWSLETTER</h3>
            <form className="flex w-full" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter email for our newsletter" 
                className="flex-1 min-w-0 bg-[#163351] border-none outline-none px-4 py-3 text-[13px] text-white placeholder-gray-400 rounded-l focus:ring-1 focus:ring-white/20 transition-all"
                required
              />
              <button 
                type="submit" 
                className="bg-white text-navy px-6 py-3 text-[13px] font-bold rounded-r hover:bg-gray-100 transition-colors shrink-0"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Divider */}
        <div className="w-full h-px bg-white/10 mt-16 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Socials */}
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-gray-300">Follow us on</span>
            <div className="flex items-center gap-2">
              <a href="#" aria-label="WhatsApp" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors">
                <WhatsAppIcon />
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors">
                <YouTubeIcon />
              </a>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-gray-300">We Accept:</span>
            <div className="flex items-center gap-2">
              <MastercardIcon />
              <VisaIcon />
              <AmexIcon />
            </div>
          </div>

          {/* Copyright */}
          <div className="text-right">
            <p className="text-[12px] text-gray-400">© 2026 Sri Sresta. All Rights Reserved.</p>
            <p className="text-[11px] text-gray-500 mt-1">CIN: L72900KA2011PLC059678</p>
          </div>

        </div>
      </div>
    </footer>
  );
}
