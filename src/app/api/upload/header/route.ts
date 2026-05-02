import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

const METADATA_PATH = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

/* ── Default nav structure (mirrors Header.tsx hardcoded data) ── */
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

export async function GET() {
    try {
        const meta = JSON.parse(await readFile(METADATA_PATH, 'utf8'));
        return NextResponse.json(meta.header?.navItems ?? DEFAULT_NAV_ITEMS);
    } catch {
        return NextResponse.json(DEFAULT_NAV_ITEMS);
    }
}

export async function POST(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const action = url.searchParams.get('action'); // 'save-nav' | 'upload-callout-image'
        const navIndex = parseInt(url.searchParams.get('navIndex') ?? '-1');

        let meta;
        try {
            const fileContent = await readFile(METADATA_PATH, 'utf8');
            meta = JSON.parse(fileContent);
        } catch (readErr) {
            console.warn('[upload/header] Metadata file not found or invalid, using default structure.', readErr);
            meta = { header: { navItems: [...DEFAULT_NAV_ITEMS] } };
        }

        if (!meta.header) meta.header = { navItems: [...DEFAULT_NAV_ITEMS] };
        if (!meta.header.navItems) meta.header.navItems = [...DEFAULT_NAV_ITEMS];

        if (action === 'upload-callout-image') {
            /* Upload a callout image for a specific nav tab */
            if (navIndex < 0) return NextResponse.json({ error: 'Missing navIndex' }, { status: 400 });
            const formData = await req.formData();
            const file = formData.get('file') as File | null;
            if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

            const ext = file.type.split('/')[1] || 'png';
            const filename = `header_callout_${navIndex}.${ext}`;
            const buffer = Buffer.from(await file.arrayBuffer());
            await writeFile(path.join(UPLOADS_DIR, filename), buffer);

            if (meta.header.navItems[navIndex]?.dropdown?.callout) {
                meta.header.navItems[navIndex].dropdown.callout.image = `/uploads/${filename}`;
            }

            await writeFile(METADATA_PATH, JSON.stringify(meta, null, 2));
            revalidatePath('/');
            return NextResponse.json({ success: true, filename });
        }

        /* Default: save full nav structure sent as JSON */
        const body = await req.json();
        if (!Array.isArray(body)) return NextResponse.json({ error: 'Expected array' }, { status: 400 });
        meta.header.navItems = body;
        await writeFile(METADATA_PATH, JSON.stringify(meta, null, 2));
        revalidatePath('/');
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[upload/header] Error details:', err);
        const errorMessage = err?.message || 'Save failed';
        const isVercelReadOnly = errorMessage.includes('read-only file system') || err?.code === 'EROFS';
        
        return NextResponse.json({ 
            error: isVercelReadOnly ? 'Vercel Deployment Error: Cannot write to file system. Please use a database or Vercel Blob.' : 'Save failed',
            details: errorMessage,
            code: err?.code
        }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const meta = JSON.parse(await readFile(METADATA_PATH, 'utf8'));
        meta.header = { navItems: [...DEFAULT_NAV_ITEMS] };
        await writeFile(METADATA_PATH, JSON.stringify(meta, null, 2));
        revalidatePath('/');
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
    }
}
