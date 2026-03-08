import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/src/utils/supabase/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const bucket = searchParams.get('bucket');
    const path = searchParams.get('path');

    if (!bucket || !path) {
        return new NextResponse('Missing bucket or path parameter', { status: 400 });
    }

    try {
        const supabase = await createClient();

        // Verify user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Admin bypass OR member check
        if (user.email !== 'ivarnor@gmail.com') {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('is_member')
                .eq('id', user.id)
                .single();

            if (profileError || !profile?.is_member) {
                return new NextResponse('Access Denied. Active subscription required.', { status: 403 });
            }
        } else {
            console.log('[PDF Proxy] Admin bypass for:', user.email);
        }

        // Generate a short-lived signed URL (30 seconds is enough for the proxy to fetch it)
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, 30);

        if (error || !data?.signedUrl) {
            console.error('[PDF Proxy] Error generating signed URL:', error);
            return new NextResponse('Could not generate secure PDF link.', { status: 500 });
        }

        // Fetch the PDF from Supabase storage
        const pdfResponse = await fetch(data.signedUrl);
        if (!pdfResponse.ok) {
            console.error('[PDF Proxy] Failed to fetch PDF:', pdfResponse.status, pdfResponse.statusText);
            return new NextResponse('Failed to fetch PDF content.', { status: 502 });
        }

        const pdfBuffer = await pdfResponse.arrayBuffer();

        // Re-serve the PDF with explicit Content-Type: application/pdf
        // This is the critical fix — Safari and iOS use this header to decide
        // whether to open the full multi-page PDF viewer or show a single-page image.
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline',
                'Cache-Control': 'private, max-age=60',
                'X-Content-Type-Options': 'nosniff',
            },
        });
    } catch (err: any) {
        console.error('[PDF Proxy] Unexpected error:', err);
        return new NextResponse('Internal server error.', { status: 500 });
    }
}
