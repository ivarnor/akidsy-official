import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/src/utils/supabase/server';
import { generateR2Key, getPresignedPutUrl } from '@/src/utils/r2';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.email !== 'ivarnor@gmail.com') {
      return NextResponse.json(
        { error: 'Forbidden. Admin privileges required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { filename, contentType, type, category } = body;

    if (!filename) {
      return NextResponse.json(
        { error: 'Missing required field: filename' },
        { status: 400 }
      );
    }

    // Determine folder structure based on asset type and category
    let folder = 'content/general';
    if (type === 'thumbnail') {
      folder = 'thumbnails/covers';
    } else if (category) {
      const cleanCategory = category
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, '');
      folder = `content/${cleanCategory}`;
    }

    const key = generateR2Key(folder, filename);
    const resolvedContentType = contentType || 'application/octet-stream';

    const { uploadUrl, publicUrl } = await getPresignedPutUrl(
      key,
      resolvedContentType,
      900 // 15 minutes validity
    );

    return NextResponse.json({
      success: true,
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (err: any) {
    console.error('[R2 Presigned URL Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
