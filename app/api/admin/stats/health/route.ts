import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Authenticate admin securely using SSR client to read cookies
        const cookieStore = await cookies();
        const supabaseServer = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch { }
                    },
                },
            }
        );

        const { data: { user } } = await supabaseServer.auth.getUser();

        if (!user || user.email !== 'ivarnor@gmail.com') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Use Admin client for sensitive queries
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // 1. Fetch Profiles for Trials & Signups
        const { data: profiles, error: profilesError } = await supabaseAdmin
            .from('profiles')
            .select('*');

        if (profilesError) throw profilesError;

        let activeTrials = 0;
        let signupsThisMonth = 0;
        let cancellationsThisMonth = 0; // Simulated or actual if tracked. Since we don't have a churn webhook built out, we will mock or approximate this. We'll mark activeTrials.

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        profiles?.forEach(profile => {
            const createdAt = new Date(profile.created_at);
            if (createdAt >= firstDayOfMonth) {
                signupsThisMonth++;
            }
            if (profile.subscription_status === 'trialing') {
                activeTrials++;
            }
            // we could also infer churn by checking if someone was a member but isn't now, if that data exists. For now we use fake churn or 0 if unknown.
            if (profile.subscription_status === 'canceled' && new Date(profile.updated_at || createdAt) >= firstDayOfMonth) {
                cancellationsThisMonth++;
            }
        });

        let churnRate = signupsThisMonth > 0 ? ((cancellationsThisMonth / signupsThisMonth) * 100).toFixed(1) : 0;

        // 2. Fetch Unverified Users from Supabase Auth
        // Supabase allows admin API to list users
        // Use pagination if there are many users, getting up to 1000 for simplicity here
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });

        if (authError) throw authError;

        const unverifiedUsers = authData.users
            .filter(u => !u.email_confirmed_at)
            .map(u => ({
                id: u.id,
                email: u.email,
                created_at: u.created_at
            }))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // 3. Fetch Top Content
        const { data: topContent, error: contentError } = await supabaseAdmin
            .from('content')
            .select('id, title, category, views')
            .order('views', { ascending: false })
            .limit(5);

        if (contentError) throw contentError;

        return NextResponse.json({
            activeTrials,
            churnRate,
            signupsThisMonth,
            cancellationsThisMonth,
            unverifiedUsers,
            topContent: topContent || []
        });

    } catch (error: any) {
        console.error('Error fetching admin health stats:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
