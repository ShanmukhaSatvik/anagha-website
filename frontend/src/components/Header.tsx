'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchCatalogFilters, type CatalogFilterOption } from '@/lib/erpCatalog';
import { fetchMe, logoutAccount, type WebsiteCustomer } from '@/lib/auth';

type NavItem = { label: string; slug: string };

const NAV_BAR_LIMIT = 8;

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const HeartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const VDIV = 'w-px h-[14px] bg-gray-300 shrink-0 mx-1.5 xl:mx-2';
const ITEM3 =
  'flex items-center justify-center text-[10px] xl:text-[12px] text-gray-700 cursor-pointer whitespace-nowrap w-auto xl:w-[60px]';
const ITEM4 =
  'flex items-center justify-center text-[10px] xl:text-[12px] text-gray-700 cursor-pointer whitespace-nowrap w-auto xl:w-[60px]';

function toNavItem(g: CatalogFilterOption): NavItem {
  const slug = g.slug || String(g.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return { label: String(g.name).toUpperCase(), slug };
}

function sortByCountDesc(groups: CatalogFilterOption[]) {
  return [...groups].sort((a, b) => (b.count || 0) - (a.count || 0) || a.name.localeCompare(b.name));
}

export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [allGroups, setAllGroups] = useState<NavItem[]>([]);
  const [navReady, setNavReady] = useState(false);
  const [customer, setCustomer] = useState<WebsiteCustomer | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMe()
      .then((me) => {
        if (!cancelled) setCustomer(me);
      })
      .catch(() => {
        if (!cancelled) setCustomer(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSignOut() {
    try {
      await logoutAccount();
      setCustomer(null);
      router.refresh();
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadNav() {
      try {
        const payload = await fetchCatalogFilters();
        const groups = sortByCountDesc(payload.filters?.group || []);
        if (cancelled) return;

        const mapped = groups.map(toNavItem).filter((g) => g.slug);
        setAllGroups(mapped);
        setNavItems([
          ...mapped.slice(0, NAV_BAR_LIMIT),
          { label: 'ALL JEWELLERY', slug: 'all-jewellery' },
        ]);
      } catch {
        if (!cancelled) {
          setAllGroups([]);
          setNavItems([{ label: 'ALL JEWELLERY', slug: 'all-jewellery' }]);
        }
      } finally {
        if (!cancelled) setNavReady(true);
      }
    }

    loadNav();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      {/* Mobile header */}
      <div className="flex lg:hidden items-center justify-between px-4 h-16 bg-white shrink-0 sticky top-0 z-[100] shadow-sm">
        <div className="flex items-center gap-3">
          <button aria-label="Menu" className="text-navy" onClick={() => setMobileMenuOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center bg-white shrink-0">
            <img
              src="/images/logo_icon.png"
              alt="Logo"
              className="w-full h-full object-contain [clip-path:circle(47%)] scale-[0.85]"
            />
          </div>
        </div>
        <Link href="/" className="flex items-center">
          <Image
            src="/images/brand_logo.png"
            alt="Anagha"
            width={120}
            height={40}
            className="h-10 w-auto object-contain [clip-path:inset(1px_4px)]"
            style={{ width: 'auto' }}
            priority
          />
        </Link>
        <div className="flex items-center gap-4 text-navy">
          <SearchIcon />
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col lg:hidden overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <Image
              src="/images/brand_logo.png"
              alt="Anagha"
              width={120}
              height={40}
              className="h-10 w-auto object-contain [clip-path:inset(1px_4px)]"
              style={{ width: 'auto' }}
            />
            <button aria-label="Close Menu" onClick={() => setMobileMenuOpen(false)} className="text-navy p-1">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {!navReady ? (
              <p className="px-6 py-4 text-[12px] text-gray-400">Loading categories…</p>
            ) : (
              <ul className="flex flex-col">
                {allGroups.map((item) => (
                  <li key={item.slug} className="border-b border-gray-50">
                    <Link
                      href={`/jewellery/${item.slug}`}
                      className="block px-6 py-4 text-navy font-semibold text-[12px]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="border-b border-gray-50">
                  <Link
                    href="/jewellery"
                    className="block px-6 py-4 text-navy font-semibold text-[12px]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ALL JEWELLERY
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Desktop white top */}
      <div className="bg-white hidden lg:block overflow-x-clip w-full max-w-[100vw]">
        <div className="flex items-end h-[76px] pl-[120px] xl:pl-[130px] pr-4 xl:pr-10 pb-[10px]">
          <Link href="/" className="flex items-center shrink-0 translate-y-2.5">
            <Image
              src="/images/brand_logo.png"
              alt="Anagha"
              width={280}
              height={80}
              className="h-[50px] xl:h-[60px] w-auto object-contain [clip-path:inset(1px_4px)]"
              style={{ width: 'auto' }}
              priority
            />
          </Link>

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

          <div className="flex flex-col items-end ml-auto shrink-0 gap-y-[3px]">
            <div className="flex items-center h-[33px]">
              {customer ? (
                <>
                  {customer.is_admin ? (
                    <>
                      <Link href="/upload" className={`${ITEM3} hover:text-navy`}>
                        Admin
                      </Link>
                      <span className={VDIV} />
                    </>
                  ) : null}
                  <span className={`${ITEM3} text-navy font-semibold max-w-[120px] truncate`} title={customer.email}>
                    {customer.name.split(' ')[0]}
                  </span>
                  <span className={VDIV} />
                  <button type="button" onClick={onSignOut} className={`${ITEM4} hover:text-navy`}>
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/account/login" className={`${ITEM3} hover:text-navy`}>
                    Sign in
                  </Link>
                  <span className={VDIV} />
                  <Link href="/account/signup" className={`${ITEM4} hover:text-navy`}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center h-[33px]">
              <Link
                href="#"
                className="flex flex-row items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-[10px] xl:text-[11px] leading-tight cursor-pointer whitespace-nowrap w-auto px-4 py-1.5 rounded-full shadow-sm transition-all"
              >
                <WhatsAppIcon />
                <span>
                  Connect
                  <br />
                  With Us
                </span>
              </Link>
              <span className={VDIV} />
              <div className={`${ITEM3} relative`}>
                <div className="relative inline-flex text-[#ff4d8d]">
                  <HeartIcon />
                  <span className="absolute -top-1 -right-2 w-[15px] h-[15px] rounded-full border border-[#ff4d8d] bg-white text-[9px] flex items-center justify-center font-bold">
                    0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop navy nav — ERP groups */}
      <nav className="sticky top-0 z-50 bg-navy h-[46px] hidden lg:flex items-center px-10 overflow-x-clip w-full max-w-[100vw]">
        <div
          className={`absolute left-10 z-50 transition-all duration-300 ease-in-out origin-top-left bg-white rounded-full overflow-hidden shadow-sm flex items-center justify-center ${
            scrolled ? 'w-[30px] h-[30px] top-[8px]' : 'w-[75px] h-[75px] -top-[64px]'
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

        <ul className="flex items-center h-full w-full justify-center gap-2 xl:gap-5 list-none pl-10">
          {!navReady ? (
            <li className="text-white/50 text-[11px] tracking-wide">Loading…</li>
          ) : (
            navItems.map((item) => {
              const isAll = item.slug === 'all-jewellery';
              return (
                <li
                  key={item.slug}
                  className="group relative flex items-center h-full px-1 text-white text-[10.5px] xl:text-[12px] font-medium whitespace-nowrap hover:bg-white/10 transition-colors"
                >
                  <Link
                    href={isAll ? '/jewellery' : `/jewellery/${item.slug}`}
                    className="flex items-center gap-1 h-full"
                  >
                    {item.label}
                    {isAll ? <span className="text-[13px] xl:text-[15px] leading-none">▾</span> : null}
                  </Link>

                  {isAll && allGroups.length > 0 ? (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-2xl w-[520px] max-h-[70vh] overflow-y-auto py-6 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] border-t-2 border-navy">
                      <div className="px-8">
                        <h4 className="text-navy font-bold text-[14px] mb-4 border-b border-gray-200 pb-2">
                          Shop by category
                        </h4>
                        <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                          {allGroups.map((g) => (
                            <li key={g.slug}>
                              <Link
                                href={`/jewellery/${g.slug}`}
                                className="text-[#334155] text-[13px] hover:text-[#f1592a] transition-colors"
                              >
                                {g.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href="/jewellery"
                          className="inline-block mt-5 text-[12px] font-semibold text-navy hover:text-[#f1592a]"
                        >
                          View all jewellery →
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })
          )}
        </ul>
      </nav>
    </>
  );
}
