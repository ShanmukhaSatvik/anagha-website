'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type CategoryItem = { name: string; link: string };
type Callout = { title: string; desc: string; image: string };
type Dropdown = { categories: { title: string; items: CategoryItem[] }; callout: Callout } | null;
type NavItem = { label: string; slug: string; dropdown: Dropdown };

const DEFAULT_NAV: NavItem[] = [
  { label: 'RINGS', slug: 'rings', dropdown: { categories: { title: 'By Categories', items: [{ name: 'Diamond Rings', link: '/jewellery/rings' }, { name: 'Gold Rings', link: '/jewellery/rings' }, { name: 'White Gold Rings', link: '/jewellery/rings' }, { name: 'Rose Gold Rings', link: '/jewellery/rings' }, { name: 'Platinum Rings', link: '/jewellery/rings' }] }, callout: { title: 'Buy Solitaire Rings', desc: 'Starting at Rs. 30,000/-', image: '/images/header/menu-solitaire-ring.v1.webp' } } },
  { label: 'EARRINGS', slug: 'earrings', dropdown: { categories: { title: 'By Categories', items: [{ name: 'Diamond Earrings', link: '/jewellery/earrings' }, { name: 'Gold Earrings', link: '/jewellery/earrings' }, { name: 'White Gold Earrings', link: '/jewellery/earrings' }, { name: 'Rose Gold Earrings', link: '/jewellery/earrings' }, { name: 'Gemstone Earrings', link: '/jewellery/earrings' }] }, callout: { title: 'Buy Solitaire Earrings', desc: 'Starting at Rs. 45,000/-', image: '/images/header/menu-solitaire-earring.v1.webp' } } },
  { label: 'PENDANTS', slug: 'pendants', dropdown: { categories: { title: 'By Categories', items: [{ name: 'Diamond Pendants', link: '/jewellery/pendants' }, { name: 'Gold Pendants', link: '/jewellery/pendants' }, { name: 'White Gold Pendants', link: '/jewellery/pendants' }, { name: 'Rose Gold Pendants', link: '/jewellery/pendants' }, { name: 'Gemstone Pendants', link: '/jewellery/pendants' }] }, callout: { title: 'Buy Solitaire Pendants', desc: 'Starting at Rs. 40,000/-', image: '/images/header/menu-solitaire-pendant.v1.webp' } } },
  { label: 'HARAM', slug: 'haram', dropdown: { categories: { title: 'By Categories', items: [{ name: 'Guttapusala Haram', link: '/jewellery/haram#guttapusala-haram' }, { name: 'Kasulaperu Haram', link: '/jewellery/haram#kasulaperu-haram' }, { name: 'Pachala Haram', link: '/jewellery/haram#pachala-haram' }, { name: 'Nakshi Haram', link: '/jewellery/haram#nakshi-haram' }, { name: 'Gundla Haram', link: '/jewellery/haram#gundla-haram' }] }, callout: { title: 'Shop Silver Haram', desc: 'Explore our collection', image: '/images/header/silver-haram.jpg' } } },
  { label: 'VADDANAM', slug: 'vaddanam', dropdown: { categories: { title: 'By Categories', items: [{ name: 'Lakshmi Vaddanam', link: '/jewellery/vaddanam' }, { name: 'Nakshi Vaddanam', link: '/jewellery/vaddanam' }, { name: 'Peacock (Mayil) Vaddanam', link: '/jewellery/vaddanam' }, { name: 'Polki Vaddanam', link: '/jewellery/vaddanam' }, { name: 'Lightweight Vaddanam', link: '/jewellery/vaddanam' }] }, callout: { title: 'Shop Silver Vaddanam', desc: 'Explore our collection', image: '/images/header/silver-vaddanam.png' } } },
  { label: 'BANGLES', slug: 'bangles', dropdown: { categories: { title: 'By Categories', items: [{ name: 'Nakshi Bangles', link: '/jewellery/bangles' }, { name: 'Kundan Bangles', link: '/jewellery/bangles' }, { name: 'Glass Bangles', link: '/jewellery/bangles' }, { name: 'Antique Finish Bangles', link: '/jewellery/bangles' }, { name: 'Meenakari Bangles', link: '/jewellery/bangles' }] }, callout: { title: 'Shop Silver Bangles', desc: 'Explore our collection', image: '/images/header/silver-bangle.jpg' } } },
  { label: 'SOLITAIRES', slug: 'solitaires', dropdown: { categories: { title: 'By Categories', items: [{ name: 'Solitaire Rings', link: '/jewellery/solitaires' }, { name: 'Solitaire Earrings', link: '/jewellery/solitaires' }, { name: 'Solitaire Pendants', link: '/jewellery/solitaires' }] }, callout: { title: 'Shop Solitaires', desc: 'Premium Diamond Collection', image: '/images/header/solitaire-ring.v1.webp' } } },
  { label: 'ALL JEWELLERY', slug: 'all-jewellery', dropdown: null },
];

/* ── tiny SVGs ─────────────────────────────────────────── */
const PhoneIcon = () => <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>;
const ClockIcon = () => <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const HeartIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const CartIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const SearchIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const WhatsAppIcon = () => <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>;

/* Shared classes */
const VDIV = "w-px h-[14px] bg-gray-300 shrink-0 mx-1.5 xl:mx-2";  /* vertical separator */
const ITEM1 = "flex items-center gap-1.5 text-[10px] xl:text-[12px] text-gray-700 cursor-pointer whitespace-nowrap w-auto xl:w-[130px]";
const ITEM2 = "flex items-center justify-center gap-1.5 text-[10px] xl:text-[12px] text-gray-700 cursor-pointer whitespace-nowrap w-auto xl:w-[110px]";
const ITEM3 = "flex items-center justify-center text-[10px] xl:text-[12px] text-gray-700 cursor-pointer whitespace-nowrap w-auto xl:w-[60px]";
const ITEM4 = "flex items-center justify-center text-[10px] xl:text-[12px] text-gray-700 cursor-pointer whitespace-nowrap w-auto xl:w-[60px]";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>(DEFAULT_NAV);

  useEffect(() => {
    fetch('/api/upload/header')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setNavItems(data);
      })
      .catch(() => setNavItems(DEFAULT_NAV));
  }, []);

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
          <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center bg-white shrink-0">
            <img src="/images/logo_icon.png" alt="Logo" className="w-full h-full object-contain [clip-path:circle(47%)] scale-[0.85]" />
          </div>
        </div>
        <Link href="/" className="flex items-center">
          <Image src="/images/brand_logo.png" alt="Anagha" width={120} height={40} className="h-10 w-auto object-contain [clip-path:inset(1px_4px)]" style={{ width: 'auto' }} priority />
        </Link>
        <div className="flex items-center gap-4 text-navy">
          <SearchIcon />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE OVERLAY MENU
      ══════════════════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col lg:hidden overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <Image src="/images/brand_logo.png" alt="Anagha" width={120} height={40} className="h-10 w-auto object-contain [clip-path:inset(1px_4px)]" style={{ width: 'auto' }} />
            <button aria-label="Close Menu" onClick={() => setMobileMenuOpen(false)} className="text-navy p-1">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ul className="flex flex-col">
              {navItems.map(item => (
                <li key={item.slug} className="border-b border-gray-50">
                  {item.slug === 'vaddanam' ? (
                    <span className="block px-6 py-4 text-navy font-semibold text-[12px] opacity-60">{item.label}</span>
                  ) : (
                    <Link href={item.slug === 'all-jewellery' ? '/jewellery' : `/jewellery/${item.slug}`} className="block px-6 py-4 text-navy font-semibold text-[12px]">{item.label}</Link>
                  )}
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
        {/* pl-[120px] leaves space for the logo icon that overlaps from below */}
        <div className="flex items-end h-[76px] pl-[105px] xl:pl-[120px] pr-4 xl:pr-10 pb-[10px]">

          {/* Brand */}
          <Link href="/" className="flex items-center shrink-0 translate-y-2.5">
            <Image src="/images/brand_logo.png" alt="Anagha" width={280} height={80} className="h-[50px] xl:h-[60px] w-auto object-contain [clip-path:inset(1px_4px)]" style={{ width: 'auto' }} priority />
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
              <Link href="/upload" className={`${ITEM3} hover:text-navy`}>Login</Link>
              <span className={VDIV} />
              <Link href="/signup" className={`${ITEM4} hover:text-navy`}>Signup</Link>
            </div>

            {/* Row 2 — action icons */}
            <div className="flex items-center h-[33px]">
              <Link 
                href="#" 
                className="flex flex-row items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-[10px] xl:text-[11px] leading-tight cursor-pointer whitespace-nowrap w-auto px-4 py-1.5 rounded-full shadow-sm transition-all"
              >
                <WhatsAppIcon />
                <span>Connect<br />With Us</span>
              </Link>
              <span className={VDIV} />
              {/* Wishlist */}
              <div className={`${ITEM3} relative`}>
                <div className="relative inline-flex text-[#ff4d8d]">
                  <HeartIcon />
                  <span className="absolute -top-1 -right-2 w-[15px] h-[15px] rounded-full border border-[#ff4d8d] bg-white text-[9px] flex items-center justify-center font-bold">0</span>
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

        {/* Logo: position absolute, 75px = 85% in white / 15% in blue.
            top = -(75 * 0.85) = -63.75 ≈ -[64px]
            On scroll: shrinks to 30px, centred in 46px bar → top = 8px  */}
        <div
          className={`absolute left-10 z-50 transition-all duration-300 ease-in-out origin-top-left bg-white rounded-full overflow-hidden shadow-sm flex items-center justify-center ${scrolled
            ? 'w-[30px] h-[30px] top-[8px]'
            : 'w-[75px] h-[75px] -top-[64px]'
            }`}
        >
          <Image
            src="/images/logo_icon.png"
            alt="Anagha"
            width={75}
            height={75}
            className="w-full h-full object-contain [clip-path:circle(47%)] scale-[0.85]"
            priority
          />
        </div>

        {/* Nav links — pl clears the scrolled logo (34px) with a small gap */}
        <ul className="flex items-center h-full w-full justify-center gap-2 xl:gap-6 list-none pl-10">
          {navItems.map(item => {
            const n = item.label;
            const slug = item.slug;
            const dropdown = item.dropdown;

            return (
              <li
                key={slug}
                className="group relative flex items-center gap-1 h-full px-1 text-white text-[10.5px] xl:text-[12px] font-medium whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors"
              >
                {slug === 'vaddanam' ? (
                  <>
                    {n} <span className="text-[13px] xl:text-[15px] opacity-100 leading-none">▾</span>
                  </>
                ) : (
                  <Link href={slug === 'all-jewellery' ? '/jewellery' : `/jewellery/${slug}`} className="flex items-center gap-1 h-full w-full">
                    {n} <span className="text-[13px] xl:text-[15px] opacity-100 leading-none">▾</span>
                  </Link>
                )}

                {/* ── Dynamic Dropdown Logic ── */}
                {dropdown && slug !== 'solitaires' && slug !== 'all-jewellery' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-2xl w-[700px] py-10 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border-t-2 border-navy translate-y-2 group-hover:translate-y-0">
                    <div className="px-12 grid grid-cols-2 gap-12 text-left">
                      {/* Column 1: Price Range (Hardcoded as requested/standard) */}
                      <div>
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-300 pb-2">By Price Range</h4>
                        <ul className="space-y-3">
                          {['Below 10,000', 'Between 10k-20k', 'Between 20k-30k', 'Between 30k-40k', 'Between 40k-50k', '50,000 and above'].map(p => (
                            <li key={p} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors cursor-pointer">{p}</li>
                          ))}
                        </ul>
                        <button className="w-full mt-8 py-2.5 px-4 border border-gray-300 rounded text-navy text-[13px] font-medium hover:border-navy transition-colors">
                          View All {n}
                        </button>
                      </div>

                      {/* Column 2: Categories + Callout (DYNAMIC) */}
                      <div className="flex flex-col">
                        <div>
                          <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-300 pb-2">{dropdown.categories.title}</h4>
                          <ul className="space-y-3 mb-10">
                            {dropdown.categories.items.map(cat => (
                              <li key={cat.name}>
                                <Link href={cat.link} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors">{cat.name}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-auto border-t border-gray-300 pt-6 flex items-center gap-4 group/callout cursor-pointer overflow-hidden">
                          <div className="flex-1">
                            <h5 className="text-navy font-bold text-[14px] group-hover/callout:text-[#f1592a] transition-colors">{dropdown.callout.title}</h5>
                            <p className="text-gray-500 text-[12px]">{dropdown.callout.desc}</p>
                          </div>
                          <div className="w-24 h-20 shrink-0">
                            <img src={dropdown.callout.image} alt={dropdown.callout.title} className="w-full h-full object-contain object-right" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}



              {slug === 'solitaires' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-2xl w-[900px] py-10 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border-t-2 border-navy translate-y-2 group-hover:translate-y-0">
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
                      <div className="text-gray-500 text-[11px] mb-4">-- or --</div>
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
                      <div className="text-gray-500 text-[11px] mb-4">-- or --</div>
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
                      <div className="text-gray-500 text-[11px] mb-4">-- or --</div>
                      <button className="w-full py-2.5 px-4 border border-navy rounded text-navy text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-navy hover:text-white transition-all group/btn">
                        View All Preset Solitaire Earrings <span className="text-[16px] transition-transform group-hover/btn:translate-x-1">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {slug === 'all-jewellery' && (
                <div className="absolute top-full right-0 bg-white shadow-2xl w-[1000px] py-10 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border-t-2 border-navy translate-y-2 group-hover:translate-y-0">
                  <div className="px-12 grid grid-cols-4 gap-12 text-left">
                    {/* Column 1: Shop By Category */}
                    <div>
                      <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-300 pb-2">Shop By Category</h4>
                      <ul className="space-y-2.5">
                        {[
                          { name: 'Bangles' }, { name: 'Bracelets' }, { name: 'Earrings' }, { name: 'Gold Chains' }, { name: 'Kadas' }, { name: 'Mangalsutras' },
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
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-300 pb-2">Men's Jewellery</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {['Bracelets', 'Studs', 'Kadas', 'Pendants', 'Rings', 'Cufflinks', 'Chains'].map(item => (
                            <div key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors">{item}</div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-300 pb-2">Kids Jewellery</h4>
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
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-300 pb-2">Platinum Jewellery</h4>
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
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-300 pb-2">Gold Jewellery</h4>
                        <div className="space-y-2">
                          {['Bangles', 'Bracelets', 'Chains', 'Earrings', 'Mangalsutras', 'Necklaces', 'Nose Pins', 'Pendants', 'Rings'].map(item => (
                            <div key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors">{item}</div>
                          ))}
                        </div>
                        <div className="mt-4 text-navy font-bold text-[12px] hover:text-[#f1592a] transition-colors cursor-pointer">View All ▸</div>
                      </div>
                      <div>
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-300 pb-2">Gemstone Jewellery</h4>
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
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-300 pb-2">Diamond Jewellery</h4>
                        <div className="space-y-2">
                          {['Bangles', 'Bracelets', 'Cufflinks', 'Earrings', 'Mangalsutras', 'Necklaces', 'Nose Pins', 'Pendants', 'Rings'].map(item => (
                            <div key={item} className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors">{item}</div>
                          ))}
                        </div>
                        <div className="mt-4 text-navy font-bold text-[12px] hover:text-[#f1592a] transition-colors cursor-pointer">View All ▸</div>
                      </div>
                      <div>
                        <h4 className="text-navy font-bold text-[15px] mb-5 border-b border-gray-300 pb-2">Pearl Jewellery</h4>
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

            </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
