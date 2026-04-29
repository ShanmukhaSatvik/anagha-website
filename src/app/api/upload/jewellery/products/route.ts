import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';
import { PRODUCTS } from '@/lib/data';

const META   = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');
const UPLOAD = path.join(process.cwd(), 'public', 'uploads');

async function readMeta() {
  try { return JSON.parse(await readFile(META, 'utf8')); } catch { return {}; }
}
async function writeMeta(data: object) {
  await writeFile(META, JSON.stringify(data, null, 2));
}

export async function GET(req: NextRequest) {
  const category = new URL(req.url).searchParams.get('category');
  const meta = await readMeta();
  let products = meta.jewelleryProducts ?? PRODUCTS;
  
  if (category) {
    products = products.filter((p: any) => p.category === category);
  }
  
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const name = form.get('name') as string;
    const category = form.get('category') as string;
    const price = form.get('price') as string;
    const originalPrice = form.get('originalPrice') as string;
    const file = form.get('file') as File | null;

    if (!name || !category || !price || !file) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const ext = file.name.split('.').pop();
    const filename = `product_${Date.now()}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD, filename), buf);

    const meta = await readMeta();
    const products = meta.jewelleryProducts ?? [...PRODUCTS];
    
    const newProduct = {
      id: Date.now(),
      category,
      name,
      price,
      originalPrice: originalPrice || price,
      image: `/uploads/${filename}`
    };

    products.push(newProduct);
    meta.jewelleryProducts = products;
    await writeMeta(meta);
    revalidatePath('/');
    
    return NextResponse.json({ success: true, product: newProduct });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const form = await req.formData();
    const id = Number(form.get('id'));
    const name = form.get('name') as string;
    const category = form.get('category') as string;
    const price = form.get('price') as string;
    const originalPrice = form.get('originalPrice') as string;
    const description = form.get('description') as string;
    const offer = form.get('offer') as string;
    const file = form.get('file') as File | null;

    if (isNaN(id)) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const meta = await readMeta();
    let products = meta.jewelleryProducts ?? [...PRODUCTS];
    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const product = products[index];
    if (name) product.name = name;
    if (category) product.category = category;
    if (price) product.price = price;
    if (originalPrice) product.originalPrice = originalPrice;
    if (description) product.description = description;
    if (offer) product.offer = offer;

    if (file) {
      // Clean old image if it was an upload
      if (product.image?.startsWith('/uploads/')) {
        try { await unlink(path.join(process.cwd(), 'public', product.image)); } catch {}
      }
      const ext = file.name.split('.').pop();
      const filename = `product_${Date.now()}.${ext}`;
      const buf = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(UPLOAD, filename), buf);
      product.image = `/uploads/${filename}`;
    }

    meta.jewelleryProducts = products;
    await writeMeta(meta);
    revalidatePath('/');

    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = Number(new URL(req.url).searchParams.get('id'));
  if (isNaN(id)) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  const meta = await readMeta();
  let products = meta.jewelleryProducts ?? [...PRODUCTS];
  
  const target = products.find((p: any) => p.id === id);
  if (target?.image?.startsWith('/uploads/')) {
    try { await unlink(path.join(process.cwd(), 'public', target.image)); } catch {}
  }

  products = products.filter((p: any) => p.id !== id);
  meta.jewelleryProducts = products;
  await writeMeta(meta);
  revalidatePath('/');
  
  return NextResponse.json({ success: true });
}
