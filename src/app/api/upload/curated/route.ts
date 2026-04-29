import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

const META = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');
const UPLOAD = path.join(process.cwd(), 'public', 'uploads');

const readMeta = async () => {
  try {
    const data = await readFile(META, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
};

const writeMeta = async (data: object) => {
  await writeFile(META, JSON.stringify(data, null, 2));
};

export const GET = async () => {
  const meta = await readMeta();
  return NextResponse.json({
    slots: meta.curatedSlots ?? new Array(12).fill(null),
    titles: meta.curatedTitles ?? [],
  });
};

export const POST = async (req: NextRequest) => {
  try {
    const form = await req.formData();
    const indexStr = form.get('index');
    const file = form.get('file') as File | null;
    const title = form.get('title');
    const titleIndexStr = form.get('titleIndex');

    const meta = await readMeta();

    if (file && indexStr !== null) {
      const index = Number(indexStr);
      const ext = file.name.split('.').pop();
      const filename = `curated_${index}.${ext}`;
      const buf = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(UPLOAD, filename), buf);

      const slots = meta.curatedSlots ?? new Array(12).fill(null);
      slots[index] = filename;
      meta.curatedSlots = slots;
    }

    if (title !== null && titleIndexStr !== null) {
      const tIdx = Number(titleIndexStr);
      const titles = meta.curatedTitles ?? [];
      titles[tIdx] = title as string;
      meta.curatedTitles = titles;
    }

    await writeMeta(meta);
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Curated POST Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const indexStr = url.searchParams.get('index');
    const titleIndexStr = url.searchParams.get('titleIndex');
    const meta = await readMeta();

    if (indexStr !== null) {
      const index = Number(indexStr);
      const slots = meta.curatedSlots ?? new Array(12).fill(null);
      const old = slots[index];
      if (old) {
        try {
          await unlink(path.join(UPLOAD, old));
        } catch (e) {
          console.warn('Failed to delete file:', old, e);
        }
      }
      slots[index] = null;
      meta.curatedSlots = slots;
    }

    if (titleIndexStr !== null) {
      const tIdx = Number(titleIndexStr);
      const titles = meta.curatedTitles ?? [];
      titles[tIdx] = null;
      meta.curatedTitles = titles;
    }

    await writeMeta(meta);
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Curated DELETE Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
