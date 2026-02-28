import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover',
});

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Authenticate admin securely
        const cookieStore = await cookies();
        const supabase = createServerClient(
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

        const { data: { user } } = await supabase.auth.getUser();

        if (!user || user.email !== 'ivarnor@gmail.com') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // 1. Calculate MRR (Monthly Recurring Revenue)
        let mrr = 0;
        let hasMore = true;
        let startingAfter: string | undefined = undefined;

        while (hasMore) {
            const subscriptions: Stripe.ApiList<Stripe.Subscription> = await stripe.subscriptions.list({
                status: 'active',
                limit: 100,
                starting_after: startingAfter,
                expand: ['data.plan'],
            });

            for (const sub of subscriptions.data) {
                // Approximate MRR for items
                for (const item of sub.items.data) {
                    if (item.plan && item.plan.amount && item.plan.interval === 'month') {
                        // Monthly interval
                        mrr += (item.plan.amount / 100) * (item.quantity || 1) / (item.plan.interval_count || 1);
                    } else if (item.plan && item.plan.amount && item.plan.interval === 'year') {
                        // Yearly interval (divide by 12 for MRR)
                        mrr += (item.plan.amount / 100) * (item.quantity || 1) / 12;
                    }
                }
            }

            hasMore = subscriptions.has_more;
            if (subscriptions.data.length > 0) {
                startingAfter = subscriptions.data[subscriptions.data.length - 1].id;
            }
        }

        // 2. Fetch 30-day historical revenue and total
        const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
        let totalRevenue30d = 0;

        // Prepare chart data array initialized with 30 days of 0 revenue
        const chartData: { date: string, revenue: number }[] = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            chartData.push({
                date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: 0
            });
        }

        hasMore = true;
        startingAfter = undefined;

        while (hasMore) {
            const invoices: Stripe.ApiList<Stripe.Invoice> = await stripe.invoices.list({
                created: { gte: thirtyDaysAgo },
                status: 'paid',
                limit: 100,
                starting_after: startingAfter
            });

            for (const inv of invoices.data) {
                const amount = inv.amount_paid / 100;
                totalRevenue30d += amount;

                // Add to chart data
                if (inv.created) {
                    const invDate = new Date(inv.created * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const dayIndex = chartData.findIndex(d => d.date === invDate);
                    if (dayIndex !== -1) {
                        chartData[dayIndex].revenue += amount;
                    }
                }
            }

            hasMore = invoices.has_more;
            if (invoices.data.length > 0) {
                startingAfter = invoices.data[invoices.data.length - 1].id;
            }
        }

        return NextResponse.json({
            mrr: Math.round(mrr),
            totalRevenue30d: Math.round(totalRevenue30d),
            chartData
        });

    } catch (error: any) {
        console.error('Error fetching admin revenue stats:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
