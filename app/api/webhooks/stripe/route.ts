import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
    // Initialize Supabase with service role key to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event: Stripe.Event;

    try {
        if (!signature || !webhookSecret) {
            console.error('Missing signature or webhook secret');
            return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
        }

        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email || session.client_reference_id;
        const customerId = session.customer as string;

        if (customerEmail) {
            console.log(`Payment successful for: ${customerEmail}`);

            // Update the user profile in Supabase to is_member = true
            // We look up by email since that's what we matched on the checkout
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    is_member: true,
                    stripe_customer_id: customerId,
                    subscription_status: 'trialing'
                })
                .eq('email', customerEmail)
                .select();

            if (error) {
                console.error('Error updating Supabase profile:', error);
            } else {
                console.log('Successfully updated Supabase profile:', data);
            }
        } else {
            console.error('No customer email found in session', session);
        }
    }

    return NextResponse.json({ received: true });
}
