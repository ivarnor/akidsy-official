import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/src/utils/supabase/server';
import { deleteR2Object } from '@/src/utils/r2';

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
    const { key, url } = body;

    let targetKey = key;
    if (!targetKey && url) {
      const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/+$/, '');
      if (publicBase && url.startsWith(publicBase)) {
        targetKey = url.slice(publicBase.length + 1).split('?')[0];
      } else if (url.includes('.r2.dev/')) {
        targetKey = url.split('.r2.dev/')[1]?.split('?')[0];
      }
    }

    if (!targetKey) {
      return NextResponse.json(
        { error: 'Missing required field: key or url' },
        { status: 400 }
      );
    }

    await deleteR2Object(targetKey);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[R2 Delete Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to delete object from R2' },
      { status: 500 }
    );
  }
}
