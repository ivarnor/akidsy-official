// app/api/content/view/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/src/utils/supabase/server';

export async function POST(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'Missing content ID' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

        if (!supabaseUrl || !supabaseServiceRoleKey) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

        // Fetch current views
        const { data: content, error: fetchError } = await supabaseAdmin
            .from('content')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !content) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }

        // Increment views
        const { error: updateError } = await supabaseAdmin
            .from('content')
            .update({ views: (content.views || 0) + 1 })
            .eq('id', id);

        if (updateError) {
            console.error('Error updating views:', updateError);
            return NextResponse.json({ error: 'Failed to update views' }, { status: 500 });
        }

        // --- Activity Log Logic ---
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // Get current profile
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('activity_log')
                .eq('id', user.id)
                .single();

            const currentLog = Array.isArray(profile?.activity_log) ? profile.activity_log : [];
            const newEntry = {
                id: content.id,
                title: content.title,
                category: content.category,
                timestamp: new Date().toISOString()
            };

            // Keep only the last 20 activities max to prevent bloat
            const updatedLog = [...currentLog, newEntry].slice(-20);

            await supabaseAdmin
                .from('profiles')
                .update({ activity_log: updatedLog })
                .eq('id', user.id);
        }

        return NextResponse.json({ success: true, views: (content.views || 0) + 1 });
    } catch (error: any) {
        console.error('Error processing view event:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
