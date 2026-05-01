import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

const META = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');
const UPLOAD = path.join(process.cwd(), 'public', 'uploads');

const DEFAULT_CATS = [
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
  { name: 'Haram', image: '/images/category/guttapusala_haram1.png' }
];

async function readMeta() {
  try { return JSON.parse(await readFile(META, 'utf8')); } catch { return {}; }
}
async function writeMeta(data: object) {
  await writeFile(META, JSON.stringify(data, null, 2));
}

export async function GET() {
  const meta = await readMeta();
  return NextResponse.json(meta.jewelleryCategories ?? DEFAULT_CATS);
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const name = form.get('name') as string;
    const file = form.get('file') as File | null;
    const indexStr = form.get('index');

    if (!name && !file && indexStr === null) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const meta = await readMeta();
    const cats = meta.jewelleryCategories ?? [...DEFAULT_CATS];

    if (indexStr !== null) {
      const idx = Number(indexStr);
      if (idx >= 0 && idx < cats.length) {
        if (name) {
          const oldName = cats[idx].name;
          const oldSlug = oldName.toLowerCase().replace(/ /g, '-');
          const newSlug = name.toLowerCase().replace(/ /g, '-');

          cats[idx].name = name;

          // Sync products
          if (meta.jewelleryProducts) {
            meta.jewelleryProducts = meta.jewelleryProducts.map((p: any) => {
              if (p.category === oldSlug) return { ...p, category: newSlug };
              return p;
            });
          }
        }
        if (file) {
          const ext = file.name.split('.').pop();
          const filename = `jewel_cat_${idx}_${Date.now()}.${ext}`;
          const buf = Buffer.from(await file.arrayBuffer());
          await writeFile(path.join(UPLOAD, filename), buf);

          // Cleanup old image if it was a custom upload
          if (cats[idx].image?.startsWith('/uploads/')) {
            try { await unlink(path.join(process.cwd(), 'public', cats[idx].image)); } catch { }
          }
          cats[idx].image = `/uploads/${filename}`;
        }
      }
    } else if (name) {
      // Add new
      cats.push({ name, image: null });
    }

    meta.jewelleryCategories = cats;
    await writeMeta(meta);
    revalidatePath('/');
    return NextResponse.json({ success: true, categories: cats });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const name = new URL(req.url).searchParams.get('name');
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  const meta = await readMeta();
  let cats = meta.jewelleryCategories ?? [...DEFAULT_CATS];

  const target = cats.find((c: any) => c.name === name);
  if (target?.image?.startsWith('/uploads/')) {
    try { await unlink(path.join(process.cwd(), 'public', target.image)); } catch { }
  }

  const slug = name.toLowerCase().replace(/ /g, '-');
  cats = cats.filter((c: any) => c.name !== name);

  // Cleanup products
  if (meta.jewelleryProducts) {
    // Optional: Clean up images of deleted products too
    const toDelete = meta.jewelleryProducts.filter((p: any) => p.category === slug);
    for (const p of toDelete) {
      if (p.image?.startsWith('/uploads/')) {
        try { await unlink(path.join(process.cwd(), 'public', p.image)); } catch { }
      }
    }
    meta.jewelleryProducts = meta.jewelleryProducts.filter((p: any) => p.category !== slug);
  }

  meta.jewelleryCategories = cats;
  await writeMeta(meta);
  revalidatePath('/');
  return NextResponse.json({ success: true, categories: cats });
}
