import { NextResponse } from 'next/server';
import { createClient } from '@/src/utils/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover',
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch the user's Stripe Customer ID from their profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (profileError || !profile?.stripe_customer_id) {
            return NextResponse.json({ error: 'No active subscription or customer ID found.' }, { status: 404 });
        }

        const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/account`;

        // Create the Stripe Billing Portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: returnUrl,
        });

        return NextResponse.json({ url: portalSession.url });

    } catch (err: any) {
        console.error('Error creating portal session:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
