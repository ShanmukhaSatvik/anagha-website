'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAV = [
  'WATCH JEWELLERY','RINGS','EARRINGS',
  'PENDANTS','SOLITAIRES','ALL JEWELLERY','GIFTS','GOLD COINS','OFFERS',
];

/* ── tiny SVGs ─────────────────────────────────────────── */
const PhoneIcon  = () => <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
const ClockIcon  = () => <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const PinIcon    = () => <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const HeartIcon  = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>;
const CartIcon   = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>;
const SearchIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>;

/* Shared classes */
const VDIV  = "w-px h-[14px] bg-gray-300 shrink-0 mx-1.5 xl:mx-2";  /* vertical separator */
const ITEM1 = "flex items-center gap-1.5 text-[10px] xl:text-[12px] text-gray-700 cursor-pointer whitespace-nowrap w-auto xl:w-[130px]";
const ITEM2 = "flex items-center justify-center gap-1.5 text-[10px] xl:text-[12px] text-gray-700 cursor-pointer whitespace-nowrap w-auto xl:w-[110px]";
const ITEM3 = "flex items-center justify-center text-[10px] xl:text-[12px] text-gray-700 cursor-pointer whitespace-nowrap w-auto xl:w-[60px]";
const ITEM4 = "flex items-center justify-center text-[10px] xl:text-[12px] text-gray-700 cursor-pointer whitespace-nowrap w-auto xl:w-[60px]";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          MOBILE HEADER
      ══════════════════════════════════════════════════════ */}
      <div className="flex lg:hidden items-center justify-between px-4 h-16 bg-white shrink-0 sticky top-0 z-[100] shadow-sm">
        <div className="flex items-center gap-3">
          <button aria-label="Menu" className="text-navy" onClick={() => setMobileMenuOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <img src="/images/logo_icon.png" alt="Logo" className="w-8 h-8 object-contain rounded-full border border-gray-100" />
        </div>
        <Link href="/" className="font-display text-[16px] font-bold tracking-[3px] text-navy">
          SRI SRESTA
        </Link>
        <div className="flex items-center gap-4 text-navy">
          <SearchIcon />
          <CartIcon />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE OVERLAY MENU
      ══════════════════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col lg:hidden overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span className="font-display text-[16px] font-bold tracking-[3px] text-navy">SRI SRESTA</span>
            <button aria-label="Close Menu" onClick={() => setMobileMenuOpen(false)} className="text-navy p-1">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ul className="flex flex-col">
              {NAV.map(n => (
                <li key={n} className="border-b border-gray-50">
                  <Link href="#" className="block px-6 py-4 text-navy font-semibold text-[12px]">{n}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          WHITE TOP SECTION   — scrolls away naturally
      ══════════════════════════════════════════════════════ */}
      <div className="bg-white hidden lg:block">
        {/* pl-[130px] leaves space for the 90px logo that overlaps from below */}
        <div className="flex items-end h-[76px] pl-[110px] xl:pl-[130px] pr-4 xl:pr-10 pb-[10px]">

          {/* Brand */}
          <Link
            href="/"
            className="font-display text-[28px] font-bold tracking-[6px] text-navy shrink-0 leading-none pb-0.5"
          >
            SRI SRESTA
          </Link>

          {/* Search — centred via auto margins */}
          <div className="flex max-w-[300px] xl:max-w-[480px] shrink-0 border border-gray-300 rounded overflow-hidden mx-auto mb-0.5 w-full">
            <input
              type="text"
              placeholder="Search for Jewellery"
              className="flex-1 min-w-0 border-none outline-none px-3 py-[7px] text-[13px] text-gray-700 placeholder-gray-400 bg-white"
            />
            <button
              aria-label="Search"
              className="bg-coral hover:bg-coralDark text-white px-4 flex items-center shrink-0 border-none cursor-pointer"
            >
              <SearchIcon />
            </button>
          </div>

          {/* ── Right utility panel ── */}
          <div className="flex flex-col items-end ml-auto shrink-0 gap-y-[3px]">

            {/* Row 1 — utility text links */}
            <div className="flex items-center h-[33px]">
              <span className={`${ITEM1} font-semibold text-gray-900`}>
                <PhoneIcon /> 18004190066
              </span>
              <span className={VDIV} />
              <Link href="/video-call" className={`${ITEM2} hover:text-navy`}>Video Call Cart</Link>
              <span className={VDIV} />
              <Link href="/login"      className={`${ITEM3} hover:text-navy`}>Login</Link>
              <span className={VDIV} />
              <Link href="/signup"     className={`${ITEM4} hover:text-navy`}>Signup</Link>
            </div>

            {/* Row 2 — action icons */}
            <div className="flex items-center h-[33px]">
              {/* Recently Viewed */}
              <div className={`${ITEM1} flex-row items-center gap-1.5 text-navy font-semibold text-[10px] leading-tight`}>
                <ClockIcon />
                <span>Recently<br />Viewed</span>
              </div>
              <span className={VDIV} />
              {/* Locate Store */}
              <div className={`${ITEM2} flex-row items-center gap-1.5 text-navy font-semibold text-[10px] leading-tight`}>
                <PinIcon />
                <span>Locate<br />Our Store</span>
              </div>
              <span className={VDIV} />
              {/* Wishlist */}
              <div className={`${ITEM3} relative`}>
                <div className="relative inline-flex">
                  <HeartIcon />
                  <span className="absolute -top-1 -right-2 w-[15px] h-[15px] rounded-full border border-gray-300 bg-white text-[9px] flex items-center justify-center text-gray-600">0</span>
                </div>
              </div>
              <span className={VDIV} />
              {/* Cart */}
              <div className={`${ITEM4} relative`}>
                <div className="relative inline-flex">
                  <CartIcon />
                  <span className="absolute -top-1 -right-2 w-[15px] h-[15px] rounded-full border border-gray-300 bg-white text-[9px] flex items-center justify-content text-gray-600 flex items-center justify-center">0</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BLUE NAV BAR   — sticky, always at top
          Logo extends 85% into white section above; only the logo
          shrinks on scroll — zero other animation.
      ══════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-navy h-[46px] hidden lg:flex items-center px-10 overflow-visible">

        {/* Logo: position absolute, 90px = 85% in white / 15% in blue.
            top = -(90 * 0.85) = -76.5 ≈ -[77px]
            On scroll: shrinks to 34px, centred in 46px bar → top = 6px  */}
        <div
          className={`absolute left-10 z-50 transition-all duration-300 ease-in-out origin-top-left ${
            scrolled
              ? 'w-[34px] h-[34px] top-[6px]'
              : 'w-[90px] h-[90px] -top-[77px]'
          }`}
        >
          <Image
            src="/images/logo_icon.png"
            alt="Sri Sresta"
            width={90}
            height={90}
            className="w-full h-full rounded-full block"
            priority
          />
        </div>

        {/* Nav links — pl clears the scrolled logo (34px) with a small gap */}
        <ul className="flex items-center h-full w-full justify-start gap-2 xl:gap-6 pl-[50px] xl:pl-[60px] list-none">
          {NAV.map(n => (
            <li
              key={n}
              className="group relative flex items-center gap-1 h-full px-1 text-white text-[10.5px] xl:text-[12px] font-medium whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors"
            >
              {n} <span className="text-[13px] xl:text-[15px] opacity-100 leading-none">▾</span>
              
              {n === 'WATCH JEWELLERY' && (
                <div className="absolute top-full left-0 bg-white shadow-2xl w-[900px] py-10 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border-t-2 border-navy translate-y-2 group-hover:translate-y-0">
                  <div className="px-10 grid grid-cols-3 gap-10">
                    <div className="flex flex-col items-center text-center">
                      <h4 className="text-navy font-bold text-[16px] mb-4 w-full text-left border-b border-dotted border-gray-200 pb-2 uppercase tracking-wide">Watch Charms</h4>
                      <div className="h-[180px] w-full flex items-center justify-center mb-6 p-4">
                        <img src="/images/header/watch_charm.webp" alt="Watch Charm" className="max-h-full max-w-full object-contain" />
                      </div>
                      <button className="w-full py-2.5 px-4 border border-navy rounded text-navy text-[13px] font-medium hover:bg-navy hover:text-white transition-all">
                        Shop Charms
                      </button>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <h4 className="text-navy font-bold text-[16px] mb-4 w-full text-left border-b border-dotted border-gray-200 pb-2 uppercase tracking-wide">Watch Bands</h4>
                      <div className="h-[180px] w-full flex items-center justify-center mb-6 p-4">
                        <img src="/images/header/watch_band.webp" alt="Watch Band" className="max-h-full max-w-full object-contain" />
                      </div>
                      <button className="w-full py-2.5 px-4 border border-navy rounded text-navy text-[13px] font-medium hover:bg-navy hover:text-white transition-all">
                        Shop Bands
                      </button>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <h4 className="text-navy font-bold text-[16px] mb-4 w-full text-left border-b border-dotted border-gray-200 pb-2 uppercase tracking-wide">Watch Pins</h4>
                      <div className="h-[180px] w-full flex items-center justify-center mb-6 p-4">
                        <img src="/images/header/watch_pin.webp" alt="Watch Pin" className="max-h-full max-w-full object-contain" />
                      </div>
                      <button className="w-full py-2.5 px-4 border border-navy rounded text-navy text-[13px] font-medium hover:bg-navy hover:text-white transition-all">
                        Shop Pins
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {n === 'OFFERS' && (
                <div className="absolute top-full right-[-80px] bg-white shadow-xl min-w-[260px] py-5 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border-t-2 border-navy translate-y-2 group-hover:translate-y-0">
                  <div className="px-6">
                    <div className="text-[#334155] text-[13px] font-medium leading-[1.4] py-2 hover:text-[#f1592a] transition-colors">
                      Up To 50% Off On<br />Making Charges On Diamond Jewellery
                    </div>
                    <div className="border-t border-dotted border-gray-300 my-2" />
                    <div className="text-[#334155] text-[13px] font-medium leading-[1.4] py-2 hover:text-[#f1592a] transition-colors">
                      Up To 20% Off On<br />Making Charges On Plain Gold Jewellery
                    </div>
                  </div>
                </div>
              )}

              {n === 'GOLD COINS' && (
                <div className="absolute top-full right-[-100px] bg-white shadow-xl min-w-[320px] py-6 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border-t-2 border-navy translate-y-2 group-hover:translate-y-0">
                  <div className="px-8 grid grid-cols-2 gap-8">
                    {/* 24 Kt Section */}
                    <div>
                      <h4 className="text-navy font-bold text-[13px] mb-3 border-b border-gray-100 pb-1 uppercase tracking-tight">24 Kt (995)</h4>
                      <ul className="space-y-2">
                        {['0.5 gram', '1 gram', '2 gram', '5 gram', '10 gram', '20 gram', '50 gram'].map(weight => (
                          <li key={weight} className="text-[#334155] text-[12px] hover:text-[#f1592a] transition-colors">{weight}</li>
                        ))}
                      </ul>
                    </div>
                    {/* 22 Kt Section */}
                    <div>
                      <h4 className="text-navy font-bold text-[13px] mb-3 border-b border-gray-100 pb-1 uppercase tracking-tight">22 Kt (916)</h4>
                      <ul className="space-y-2">
                        {['1 gram', '2 gram', '5 gram', '10 gram', '20 gram', '50 gram'].map(weight => (
                          <li key={weight} className="text-[#334155] text-[12px] hover:text-[#f1592a] transition-colors">{weight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {n === 'RINGS' && (
                <div className="absolute top-full left-[-100px] bg-white shadow-2xl w-[950px] py-10 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border-t-2 border-navy translate-y-2 group-hover:translate-y-0">
                  <div className="px-12 grid grid-cols-3 gap-12 text-left">
                    {/* Column 1: Types */}
                    <div>
                      <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">Popular Ring Types</h4>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-8">
                        {['Engagement', 'Diamond', 'Couple Bands', 'Plain Gold', 'Office Wear', 'Gemstone', 'Stackable', 'Solitaire', 'Slider', 'Cocktail', 'Religious', 'Multi-finger', 'Platinum Bands', 'Navaratna', 'For Men', 'Pearl', 'For Gift'].map(item => (
                          <div key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors cursor-pointer">{item}</div>
                        ))}
                      </div>
                      <button className="w-full py-2.5 px-4 border border-gray-100 rounded text-navy text-[13px] font-medium hover:border-navy transition-colors">
                        View All Rings
                      </button>
                    </div>

                    {/* Column 2: Price Range */}
                    <div>
                      <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">By Price Range</h4>
                      <ul className="space-y-3">
                        {['Below 10,000', 'Between 10k-20k', 'Between 20k-30k', 'Between 30k-40k', 'Between 40k-50k', '50,000 and above'].map(item => (
                          <li key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors cursor-pointer">{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 3: Metals & Stones + Callout */}
                    <div className="flex flex-col">
                      <div>
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">By Metals & Stones</h4>
                        <ul className="space-y-3 mb-10">
                          {['Diamond Rings', 'Gold Rings', 'White Gold Rings', 'Rose Gold Rings', 'Platinum Rings'].map(item => (
                            <li key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors cursor-pointer">{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-auto border-t border-gray-100 pt-6 flex items-center gap-4 group/callout cursor-pointer overflow-hidden">
                        <div className="flex-1">
                          <h5 className="text-navy font-bold text-[14px] group-hover/callout:text-[#f1592a] transition-colors">Buy Solitaire Rings</h5>
                          <p className="text-gray-400 text-[12px]">Starting at Rs. 30,000/-</p>
                        </div>
                        <div className="w-24 h-20 shrink-0">
                          <img src="/images/header/menu-solitaire-ring.v1.webp" alt="Solitaire Ring" className="w-full h-full object-contain object-right" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {n === 'EARRINGS' && (
                <div className="absolute top-full left-[-200px] bg-white shadow-2xl w-[950px] py-10 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border-t-2 border-navy translate-y-2 group-hover:translate-y-0">
                  <div className="px-12 grid grid-cols-3 gap-12 text-left">
                    {/* Column 1: Types */}
                    <div>
                      <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">Popular Earring Types</h4>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-8">
                        {['Studs', 'Hoops', 'Drops', 'Multi Pierced', 'Sui Dhaga', 'Pearl', 'Jhumkas', 'Plain Gold', 'Chandbali', 'Diamond', 'Front Back', 'Gemstone', 'Ear Cuffs', 'For Kids', 'Danglers', 'For Men', 'Navaratna Earrings', 'For Gift'].map(item => (
                          <div key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors cursor-pointer">{item}</div>
                        ))}
                      </div>
                      <button className="w-full py-2.5 px-4 border border-gray-100 rounded text-navy text-[13px] font-medium hover:border-navy transition-colors">
                        View All Earrings
                      </button>
                    </div>

                    {/* Column 2: Price Range */}
                    <div>
                      <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">By Price Range</h4>
                      <ul className="space-y-3">
                        {['Below 10,000', 'Between 10k-20k', 'Between 20k-30k', 'Between 30k-40k', 'Between 40k-50k', '50,000 and above'].map(item => (
                          <li key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors cursor-pointer">{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 3: Metals & Stones + Callout */}
                    <div className="flex flex-col">
                      <div>
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">By Metals & Stones</h4>
                        <ul className="space-y-3 mb-10">
                          {['Diamond Earrings', 'Gold Earrings', 'White Gold Earrings', 'Rose Gold Earrings', 'Gemstone Earrings'].map(item => (
                            <li key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors cursor-pointer">{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-auto border-t border-gray-100 pt-6 flex items-center gap-4 group/callout cursor-pointer">
                        <div className="flex-1">
                          <h5 className="text-navy font-bold text-[14px] group-hover/callout:text-[#f1592a] transition-colors">Buy Solitaire Earrings</h5>
                          <p className="text-gray-400 text-[12px]">Starting at Rs. 45,000/-</p>
                        </div>
                        <div className="w-20 h-20 shrink-0">
                          <img src="/images/header/menu-solitaire-earring.v1.webp" alt="Solitaire Earring" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {n === 'PENDANTS' && (
                <div className="absolute top-full left-[-300px] bg-white shadow-2xl w-[950px] py-10 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border-t-2 border-navy translate-y-2 group-hover:translate-y-0">
                  <div className="px-12 grid grid-cols-3 gap-12 text-left">
                    {/* Column 1: Types */}
                    <div>
                      <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">Popular Pendant Types</h4>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-8">
                        {['Alphabet', 'Mangalsutra', 'Religious', 'Diamond', 'Fashion', 'Pearl', 'Heart Shaped', 'Gemstone', 'Lockets', 'Plain Gold', 'Office Wear', 'For Men', 'For Kids', 'Navaratna', 'For Gift'].map(item => (
                          <div key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors cursor-pointer">{item}</div>
                        ))}
                      </div>
                      <button className="w-full py-2.5 px-4 border border-gray-100 rounded text-navy text-[13px] font-medium hover:border-navy transition-colors">
                        View All Pendants
                      </button>
                    </div>

                    {/* Column 2: Price Range */}
                    <div>
                      <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">By Price Range</h4>
                      <ul className="space-y-3">
                        {['Below 10,000', 'Between 10k-20k', 'Between 20k-30k', 'Between 30k-40k', 'Between 40k-50k', '50,000 and above'].map(item => (
                          <li key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors cursor-pointer">{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 3: Metals & Stones + Callout */}
                    <div className="flex flex-col">
                      <div>
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">By Metals & Stones</h4>
                        <ul className="space-y-3 mb-10">
                          {['Diamond Pendants', 'Gold Pendants', 'White Gold Pendants', 'Rose Gold Pendants', 'Gemstone Pendants'].map(item => (
                            <li key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors cursor-pointer">{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-auto border-t border-gray-100 pt-6 flex items-center gap-4 group/callout cursor-pointer">
                        <div className="flex-1">
                          <h5 className="text-navy font-bold text-[14px] group-hover/callout:text-[#f1592a] transition-colors">Buy Solitaire Pendants</h5>
                          <p className="text-gray-400 text-[12px]">Starting at Rs. 40,000/-</p>
                        </div>
                        <div className="w-20 h-20 shrink-0">
                          <img src="/images/header/menu-solitaire-pendant.v1.webp" alt="Solitaire Pendant" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {n === 'SOLITAIRES' && (
                <div className="absolute top-full left-[-400px] bg-white shadow-2xl w-[900px] py-10 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border-t-2 border-navy translate-y-2 group-hover:translate-y-0">
                  <div className="px-10 grid grid-cols-3 gap-10">
                    {/* Rings */}
                    <div className="flex flex-col items-center text-center">
                      <h4 className="text-navy font-bold text-[16px] mb-4 w-full text-left border-b border-dotted border-gray-200 pb-2">Solitaire Rings</h4>
                      <div className="h-[180px] w-full flex items-center justify-center mb-6">
                        <img src="/images/header/solitaire-ring.v1.webp" alt="Solitaire Ring" className="max-h-full max-w-full object-contain" />
                      </div>
                      <button className="w-full py-2.5 px-4 border border-gray-200 rounded text-navy text-[13px] font-medium hover:border-navy transition-colors mb-4">
                        Make your own Solitaire Ring
                      </button>
                      <div className="text-gray-400 text-[11px] mb-4">-- or --</div>
                      <button className="w-full py-2.5 px-4 border border-navy rounded text-navy text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-navy hover:text-white transition-all group/btn">
                        View All Preset Solitaire Rings <span className="text-[16px] transition-transform group-hover/btn:translate-x-1">→</span>
                      </button>
                    </div>

                    {/* Pendants */}
                    <div className="flex flex-col items-center text-center">
                      <h4 className="text-navy font-bold text-[16px] mb-4 w-full text-left border-b border-dotted border-gray-200 pb-2">Solitaire Pendants</h4>
                      <div className="h-[180px] w-full flex items-center justify-center mb-6">
                        <img src="/images/header/solitaire-pendant.v1.webp" alt="Solitaire Pendant" className="max-h-full max-w-full object-contain" />
                      </div>
                      <button className="w-full py-2.5 px-4 border border-gray-200 rounded text-navy text-[13px] font-medium hover:border-navy transition-colors mb-4">
                        Make your own Solitaire Pendant
                      </button>
                      <div className="text-gray-400 text-[11px] mb-4">-- or --</div>
                      <button className="w-full py-2.5 px-4 border border-navy rounded text-navy text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-navy hover:text-white transition-all group/btn">
                        View All Preset Solitaire Pendants <span className="text-[16px] transition-transform group-hover/btn:translate-x-1">→</span>
                      </button>
                    </div>

                    {/* Earrings */}
                    <div className="flex flex-col items-center text-center">
                      <h4 className="text-navy font-bold text-[16px] mb-4 w-full text-left border-b border-dotted border-gray-200 pb-2">Solitaire Earrings</h4>
                      <div className="h-[180px] w-full flex items-center justify-center mb-6">
                        <img src="/images/header/solitaire-earring.v1.webp" alt="Solitaire Earring" className="max-h-full max-w-full object-contain" />
                      </div>
                      <button className="w-full py-2.5 px-4 border border-gray-200 rounded text-navy text-[13px] font-medium hover:border-navy transition-colors mb-4">
                        Make your own Solitaire Earring
                      </button>
                      <div className="text-gray-400 text-[11px] mb-4">-- or --</div>
                      <button className="w-full py-2.5 px-4 border border-navy rounded text-navy text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-navy hover:text-white transition-all group/btn">
                        View All Preset Solitaire Earrings <span className="text-[16px] transition-transform group-hover/btn:translate-x-1">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {n === 'ALL JEWELLERY' && (
                <div className="absolute top-full left-[-350px] bg-white shadow-2xl w-[1000px] py-10 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border-t-2 border-navy translate-y-2 group-hover:translate-y-0">
                  <div className="px-12 grid grid-cols-4 gap-12 text-left">
                    {/* Column 1: Shop By Category */}
                    <div>
                      <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">Shop By Category</h4>
                      <ul className="space-y-2.5">
                        {[
                          { name: 'Bangles' }, { name: 'Bracelets' }, { name: 'Earrings' }, { name: 'Gold Chains' }, { name: 'Gold Coins' }, { name: 'Kadas' }, { name: 'Mangalsutras' },
                          { name: 'Mangalsutra Bracelets', isNew: true }, { name: 'Mangalsutra Chains' }, { name: 'Necklaces' }, { name: 'Nose Pins' },
                          { name: 'Nose Rings', isNew: true }, { name: 'Nose Screws' }, { name: 'Pendants' }, { name: 'Rings' }, { name: 'Charms', isNew: true }
                        ].map(item => (
                          <li key={item.name} className="flex items-center gap-2 text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors whitespace-nowrap">
                            {item.name}
                            {item.isNew && <span className="bg-[#f1592a] text-white text-[8px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-tighter">New</span>}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 2: Men / Kids / Platinum */}
                    <div className="space-y-10">
                      <div>
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">Men's Jewellery</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {['Bracelets', 'Studs', 'Kadas', 'Pendants', 'Rings', 'Cufflinks', 'Chains'].map(item => (
                            <div key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors">{item}</div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">Kids Jewellery</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {['Earrings', 'Pendants', 'Necklaces', 'Bracelets', { name: 'Nazariyas', isNew: true }].map(item => (
                            <div key={typeof item === 'string' ? item : item.name} className="flex items-center gap-1.5 text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors whitespace-nowrap">
                              {typeof item === 'string' ? item : item.name}
                              {typeof item !== 'string' && item.isNew && <span className="bg-[#f1592a] text-white text-[8px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-tighter">New</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">Platinum Jewellery</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {['Rings', 'Earrings', 'Pendants', 'Chains'].map(item => (
                            <div key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors">{item}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Gold / Gemstone */}
                    <div className="space-y-10">
                      <div>
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">Gold Jewellery</h4>
                        <div className="space-y-2">
                          {['Bangles', 'Bracelets', 'Chains', 'Earrings', 'Mangalsutras', 'Necklaces', 'Nose Pins', 'Pendants', 'Rings'].map(item => (
                            <div key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors">{item}</div>
                          ))}
                        </div>
                        <div className="mt-4 text-navy font-bold text-[12px] hover:text-[#f1592a] transition-colors cursor-pointer">View All ▸</div>
                      </div>
                      <div>
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">Gemstone Jewellery</h4>
                        <div className="space-y-2">
                          {['Rings', 'Earrings'].map(item => (
                            <div key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors">{item}</div>
                          ))}
                        </div>
                        <div className="mt-4 text-navy font-bold text-[12px] hover:text-[#f1592a] transition-colors cursor-pointer">View All ▸</div>
                      </div>
                    </div>

                    {/* Column 4: Diamond / Pearl */}
                    <div className="space-y-10">
                      <div>
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">Diamond Jewellery</h4>
                        <div className="space-y-2">
                          {['Bangles', 'Bracelets', 'Cufflinks', 'Earrings', 'Mangalsutras', 'Necklaces', 'Nose Pins', 'Pendants', 'Rings'].map(item => (
                            <div key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors">{item}</div>
                          ))}
                        </div>
                        <div className="mt-4 text-navy font-bold text-[12px] hover:text-[#f1592a] transition-colors cursor-pointer">View All ▸</div>
                      </div>
                      <div>
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-100 pb-2">Pearl Jewellery</h4>
                        <div className="space-y-2">
                          {['Earrings', 'Necklaces'].map(item => (
                            <div key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors">{item}</div>
                          ))}
                        </div>
                        <div className="mt-4 text-navy font-bold text-[12px] hover:text-[#f1592a] transition-colors cursor-pointer">View All ▸</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {n === 'GIFTS' && (
                <div className="absolute top-full right-[-200px] bg-white shadow-xl min-w-[700px] py-8 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border-t-2 border-navy translate-y-2 group-hover:translate-y-0">
                  <div className="px-10 grid grid-cols-3 gap-10">
                    {/* Occasion */}
                    <div>
                      <h4 className="text-navy font-bold text-[13px] mb-4 border-b border-gray-100 pb-1 uppercase tracking-tight">Gifts by Occasion</h4>
                      <ul className="space-y-2.5">
                        {['Anniversary', 'Birthday', 'Engagement', 'Wedding'].map(item => (
                          <li key={item} className="text-[#334155] text-[12.5px] hover:text-[#f1592a] transition-colors">{item}</li>
                        ))}
                      </ul>
                    </div>
                    {/* Price Range */}
                    <div>
                      <h4 className="text-navy font-bold text-[13px] mb-4 border-b border-gray-100 pb-1 uppercase tracking-tight">By Price Range</h4>
                      <ul className="space-y-2.5">
                        {['Below 10,000', 'Between 10k-20k', 'Between 20k-30k', 'Between 30k-40k', 'Between 40k-50k', '50,000 and above'].map(item => (
                          <li key={item} className="text-[#334155] text-[12.5px] hover:text-[#f1592a] transition-colors">{item}</li>
                        ))}
                      </ul>
                    </div>
                    {/* Special Someone */}
                    <div>
                      <h4 className="text-navy font-bold text-[13px] mb-4 border-b border-gray-100 pb-1 uppercase tracking-tight">Gifts for special someone</h4>
                      <ul className="space-y-3.5">
                        {[
                          { label: 'For HER', price: '2,861/-' },
                          { label: 'For HIM', price: '5,820/-' },
                          { label: 'For SISTER', price: '5,746/-' },
                          { label: 'For BROTHER', price: '5,820/-' },
                          { label: 'For MOTHER', price: '5,805/-' },
                          { label: 'For FATHER', price: '5,820/-' },
                          { label: 'For FRIENDS', price: '4,221/-' },
                        ].map(item => (
                          <li key={item.label} className="group/item cursor-pointer">
                            <div className="text-navy font-bold text-[11px] group-hover/item:text-[#f1592a] transition-colors uppercase tracking-wider">{item.label}</div>
                            <div className="text-gray-400 text-[10px]">Starting at Rs. {item.price}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
