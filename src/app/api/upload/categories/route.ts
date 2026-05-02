import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

const UPLOADS_DIR   = path.join(process.cwd(), 'public', 'uploads');
const METADATA_PATH = path.join(UPLOADS_DIR, 'metadata.json');

function keyFor(type: string | null) {
  return type === 'silver' ? 'silverCategories' : 'goldCategories';
}

export async function GET(req: NextRequest) {
  try {
    const type = new URL(req.url).searchParams.get('type');
    let meta;
    try {
      meta = JSON.parse(await readFile(METADATA_PATH, 'utf8'));
    } catch {
      return NextResponse.json([]);
    }
    return NextResponse.json(meta[keyFor(type)] || []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const type     = new URL(req.url).searchParams.get('type');
    const formData = await req.formData();
    const file     = formData.get('file') as File | null;
    const index    = parseInt(formData.get('index') as string);
    const name     = formData.get('name') as string;

    if (isNaN(index)) return NextResponse.json({ error: 'Missing index' }, { status: 400 });

    let meta;
    try {
      meta = JSON.parse(await readFile(METADATA_PATH, 'utf8'));
    } catch (readErr) {
      console.warn('[upload/categories] Metadata file not found, initializing empty.', readErr);
      meta = {};
    }

    const key  = keyFor(type);
    if (!meta[key]) meta[key] = [];

    let filename = meta[key][index]?.filename || null;

    if (file) {
      const ext  = file.type.split('/')[1] || 'png';
      filename   = `cat_${type}_${index}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(UPLOADS_DIR, filename), buffer);
    }

    meta[key][index] = {
      ...(meta[key][index] ?? {}),
      name,
      filename,
      uploadedAt: new Date().toISOString(),
    };

    await writeFile(METADATA_PATH, JSON.stringify(meta, null, 2));
    revalidatePath('/');
    return NextResponse.json({ success: true, filename });
  } catch (err: any) {
    console.error('[upload/categories] Error details:', err);
    const errorMessage = err?.message || 'Upload failed';
    const isVercelReadOnly = errorMessage.includes('read-only file system') || err?.code === 'EROFS';
    
    return NextResponse.json({ 
      error: isVercelReadOnly ? 'Vercel Deployment Error: Cannot write to file system. Please use a database or Vercel Blob.' : 'Upload failed',
      details: errorMessage,
      code: err?.code
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url   = new URL(req.url);
    const type  = url.searchParams.get('type');
    const index = url.searchParams.get('index');
    const mode  = url.searchParams.get('mode');
    const meta  = JSON.parse(await readFile(METADATA_PATH, 'utf8'));
    const key   = keyFor(type);

    if (index !== null) {
      const idx = parseInt(index);
      if (meta[key]) {
        if (mode === 'delete') {
          meta[key].splice(idx, 1);
        } else {
          meta[key][idx] = null;
        }
      }
    } else {
      meta[key] = [];
    }

    await writeFile(METADATA_PATH, JSON.stringify(meta, null, 2));
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
