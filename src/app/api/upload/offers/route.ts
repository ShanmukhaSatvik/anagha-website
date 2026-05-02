import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

const META   = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');
const UPLOAD = path.join(process.cwd(), 'public', 'uploads');

async function readMeta() {
  try { 
    return JSON.parse(await readFile(META, 'utf8')); 
  } catch (err) { 
    console.warn('[upload/offers] Could not read metadata, using empty object.', err);
    return {}; 
  }
}
async function writeMeta(data: object) {
  try {
    await writeFile(META, JSON.stringify(data, null, 2));
  } catch (err: any) {
    console.error('[upload/offers] Write failed:', err);
    throw err;
  }
}

/* GET — return offers array */
export async function GET() {
  const meta = await readMeta();
  return NextResponse.json(meta.offers ?? []);
}

/* POST — upload one image at a given index */
export async function POST(req: NextRequest) {
  try {
    const form  = await req.formData();
    const index = Number(form.get('index'));
    const file  = form.get('file') as File | null;
    if (!file || isNaN(index)) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const ext      = file.name.split('.').pop();
    const filename = `offer_${index}.${ext}`;
    const buf      = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD, filename), buf);

    const meta = await readMeta();
    const offers: (string | null)[] = meta.offers ?? new Array(4).fill(null);
    offers[index] = filename;
    meta.offers = offers;
    await writeMeta(meta);
    revalidatePath('/');
    return NextResponse.json({ success: true, filename });
  } catch (err: any) {
    console.error('[upload/offers] Error details:', err);
    const errorMessage = err?.message || 'Upload failed';
    const isVercelReadOnly = errorMessage.includes('read-only file system') || err?.code === 'EROFS';
    
    return NextResponse.json({ 
      error: isVercelReadOnly ? 'Vercel Deployment Error: Cannot write to file system. Please use a database or Vercel Blob.' : 'Upload failed',
      details: errorMessage,
      code: err?.code
    }, { status: 500 });
  }
}

/* DELETE ?index=N — reset slot to default */
export async function DELETE(req: NextRequest) {
  const index = Number(new URL(req.url).searchParams.get('index'));
  const mode  = new URL(req.url).searchParams.get('mode');
  const meta  = await readMeta();
  const offers: (string | null)[] = meta.offers ?? new Array(4).fill(null);

  if (index !== null && !isNaN(index)) {
    const old = offers[index];
    if (old) {
      try { await unlink(path.join(UPLOAD, old)); } catch {}
    }
    if (mode === 'delete') {
      offers.splice(index, 1);
    } else {
      offers[index] = null;
    }
  } else {
    meta.offers = [];
  }
  meta.offers = offers;
  await writeMeta(meta);
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
