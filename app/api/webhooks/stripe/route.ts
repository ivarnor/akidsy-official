import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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
        const customerEmail = session.customer_details?.email;
        const clientReferenceId = session.client_reference_id;
        const customerId = session.customer as string;

        console.log(`Processing successful checkout: Customer=${customerId}, Email=${customerEmail}, Ref=${clientReferenceId}`);

        // Define the update payload
        const updateData = {
            is_member: true,
            stripe_customer_id: customerId,
            subscription_status: 'active'
        };

        // Try to update by client_reference_id first (assuming it's the Supabase user ID)
        if (clientReferenceId) {
            // Check if it's a UUID format
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(clientReferenceId);

            if (isUuid) {
                const { data, error } = await supabase
                    .from('profiles')
                    .update(updateData)
                    .eq('id', clientReferenceId)
                    .select();

                if (!error && data && data.length > 0) {
                    console.log('Successfully updated profile by ID:', clientReferenceId);
                    return NextResponse.json({ received: true });
                }

                if (error) console.error('Error updating by ID:', error);
            }
        }

        // Fallback: Update by email (either from customer_details or client_reference_id if it was an email)
        const emailToMatch = customerEmail || (clientReferenceId && clientReferenceId.includes('@') ? clientReferenceId : null);

        if (emailToMatch) {
            const { data, error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('email', emailToMatch)
                .select();

            if (error) {
                console.error('Error updating profile by email:', error);
            } else if (data && data.length > 0) {
                console.log('Successfully updated profile by email:', emailToMatch);
            } else {
                console.warn('No profile found to update for email:', emailToMatch);
            }
        } else {
            console.error('No valid ID or email found to identify user', session);
        }
    }

    return NextResponse.json({ received: true });
}
