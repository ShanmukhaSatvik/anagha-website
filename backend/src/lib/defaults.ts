export const DEFAULT_JEWELLERY_CATEGORIES = [
  { name: 'Rings', image: '/images/category/gold_rings.png' },
  { name: 'Earrings', image: '/images/category/gold_earrings.png' },
  { name: 'Necklaces', image: '/images/category/gold_neckalce.png' },
  { name: 'Mangalsutra', image: '/images/category/mangalsutra_gold.png' },
  { name: 'Mens Jewellery', image: '/images/category/mens_jewellery_gold.png' },
  { name: 'Chains', image: '/images/category/gold_chain.png' },
  { name: 'Pendants', image: '/images/category/gold_pendant.png' },
  { name: 'Anklets', image: '/images/category/gold_anklet.png' },
  { name: 'Bracelets', image: '/images/category/gold_bracelet.png' },
  { name: 'Bangles', image: '/images/category/gold_bangles.png' },
  { name: 'Kids Jewellery', image: '/images/category/kids_jewellery_gold.png' },
  { name: 'Nose Pins', image: '/images/category/nose_pin_gold.png' },
  { name: 'Kadas', image: '/images/category/gold_kada.png' },
  { name: 'Coins', image: '/images/category/gold_coins.png' },
  { name: 'Solitaires', image: '/images/category/solitaire_gold.png' },
  { name: 'Watch Jewellery', image: '/images/category/watch_jewellery_gold.png' },
  { name: 'Haram', image: '/images/category/guttapusala_haram1.png' },
];

export const DEFAULT_PLANS = {
  gold: {
    badge: 'Gold Mine',
    installment: '10 + 1',
    suffix: 'Monthly Plan',
    desc: 'Pay 10 installments, and get 100% off on the last one!',
    btnText: 'Enroll Now',
    btnLink: '#',
  },
  silver: {
    badge: 'Silver Mine',
    installment: '10 + 1',
    suffix: 'Monthly Plan',
    desc: 'Pay 10 installments, and get 100% off on the last one!',
    btnText: 'Enroll Now',
    btnLink: '#',
  },
};

export const DEFAULT_NAV_ITEMS = [
  {
    label: 'RINGS',
    slug: 'rings',
    dropdown: {
      categories: {
        title: 'By Categories',
        items: [
          { name: 'Diamond Rings', link: '/jewellery/rings' },
          { name: 'Gold Rings', link: '/jewellery/rings' },
          { name: 'White Gold Rings', link: '/jewellery/rings' },
          { name: 'Rose Gold Rings', link: '/jewellery/rings' },
          { name: 'Platinum Rings', link: '/jewellery/rings' },
        ],
      },
      callout: {
        title: 'Buy Solitaire Rings',
        desc: 'Starting at Rs. 30,000/-',
        image: '/images/header/menu-solitaire-ring.v1.webp',
      },
    },
  },
  {
    label: 'EARRINGS',
    slug: 'earrings',
    dropdown: {
      categories: {
        title: 'By Categories',
        items: [
          { name: 'Diamond Earrings', link: '/jewellery/earrings' },
          { name: 'Gold Earrings', link: '/jewellery/earrings' },
          { name: 'White Gold Earrings', link: '/jewellery/earrings' },
          { name: 'Rose Gold Earrings', link: '/jewellery/earrings' },
          { name: 'Gemstone Earrings', link: '/jewellery/earrings' },
        ],
      },
      callout: {
        title: 'Buy Solitaire Earrings',
        desc: 'Starting at Rs. 45,000/-',
        image: '/images/header/menu-solitaire-earring.v1.webp',
      },
    },
  },
  {
    label: 'PENDANTS',
    slug: 'pendants',
    dropdown: {
      categories: {
        title: 'By Categories',
        items: [
          { name: 'Diamond Pendants', link: '/jewellery/pendants' },
          { name: 'Gold Pendants', link: '/jewellery/pendants' },
          { name: 'White Gold Pendants', link: '/jewellery/pendants' },
          { name: 'Rose Gold Pendants', link: '/jewellery/pendants' },
          { name: 'Gemstone Pendants', link: '/jewellery/pendants' },
        ],
      },
      callout: {
        title: 'Buy Solitaire Pendants',
        desc: 'Starting at Rs. 40,000/-',
        image: '/images/header/menu-solitaire-pendant.v1.webp',
      },
    },
  },
  {
    label: 'HARAM',
    slug: 'haram',
    dropdown: {
      categories: {
        title: 'By Categories',
        items: [
          { name: 'Guttapusala Haram', link: '/jewellery/haram#guttapusala-haram' },
          { name: 'Kasulaperu Haram', link: '/jewellery/haram#kasulaperu-haram' },
          { name: 'Pachala Haram', link: '/jewellery/haram#pachala-haram' },
          { name: 'Nakshi Haram', link: '/jewellery/haram#nakshi-haram' },
          { name: 'Gundla Haram', link: '/jewellery/haram#gundla-haram' },
        ],
      },
      callout: {
        title: 'Shop Silver Haram',
        desc: 'Explore our collection',
        image: '/images/header/silver-haram.jpg',
      },
    },
  },
  {
    label: 'VADDANAM',
    slug: 'vaddanam',
    dropdown: {
      categories: {
        title: 'By Categories',
        items: [
          { name: 'Lakshmi Vaddanam', link: '/jewellery/vaddanam' },
          { name: 'Nakshi Vaddanam', link: '/jewellery/vaddanam' },
          { name: 'Peacock (Mayil) Vaddanam', link: '/jewellery/vaddanam' },
          { name: 'Polki Vaddanam', link: '/jewellery/vaddanam' },
          { name: 'Lightweight Vaddanam', link: '/jewellery/vaddanam' },
        ],
      },
      callout: {
        title: 'Shop Silver Vaddanam',
        desc: 'Explore our collection',
        image: '/images/header/silver-vaddanam.png',
      },
    },
  },
  {
    label: 'BANGLES',
    slug: 'bangles',
    dropdown: {
      categories: {
        title: 'By Categories',
        items: [
          { name: 'Nakshi Bangles', link: '/jewellery/bangles' },
          { name: 'Kundan Bangles', link: '/jewellery/bangles' },
          { name: 'Glass Bangles', link: '/jewellery/bangles' },
          { name: 'Antique Finish Bangles', link: '/jewellery/bangles' },
          { name: 'Meenakari Bangles', link: '/jewellery/bangles' },
        ],
      },
      callout: {
        title: 'Shop Silver Bangles',
        desc: 'Explore our collection',
        image: '/images/header/silver-bangle.jpg',
      },
    },
  },
  {
    label: 'SOLITAIRES',
    slug: 'solitaires',
    dropdown: {
      categories: {
        title: 'By Categories',
        items: [
          { name: 'Solitaire Rings', link: '/jewellery/solitaires' },
          { name: 'Solitaire Earrings', link: '/jewellery/solitaires' },
          { name: 'Solitaire Pendants', link: '/jewellery/solitaires' },
        ],
      },
      callout: {
        title: 'Shop Solitaires',
        desc: 'Premium Diamond Collection',
        image: '/images/header/solitaire-ring.v1.webp',
      },
    },
  },
  {
    label: 'ALL JEWELLERY',
    slug: 'all-jewellery',
    dropdown: null,
  },
];
