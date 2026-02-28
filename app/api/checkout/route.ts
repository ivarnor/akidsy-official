import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@/src/utils/supabase/server'; // Server component to check current logged-in user

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover',
});

// Standard site configuration
const DEFAULT_PRICE_ID = 'prod_U3cYESQofBj6vO';

// The POST handler works well for manual checkout requests passed from client components
export async function POST(req: Request) {
    try {
        const { priceId, userEmail } = await req.json();

        if (!priceId || !userEmail) {
            return NextResponse.json({ error: 'Missing priceId or userEmail' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            payment_method_collection: 'always',
            allow_promotion_codes: true,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            subscription_data: {
                trial_period_days: 7
            },
            success_url: `https://www.akidsy.com/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=true`,
            customer_email: userEmail,
            client_reference_id: userEmail, // Supabase user email linking
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Error creating checkout session:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// The GET handler intercepts callbacks/redirects and launches checkouts for new signups
export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login?message=Please log in to checkout`);
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            payment_method_collection: 'always',
            allow_promotion_codes: true,
            line_items: [
                {
                    price: DEFAULT_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            subscription_data: {
                trial_period_days: 7
            },
            success_url: `https://www.akidsy.com/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=true`,
            customer_email: user.email,
            client_reference_id: user.email,
        });

        // 303 See Other is optimal for navigating the browser to Stripe
        return NextResponse.redirect(session.url as string, 303);
    } catch (err: any) {
        console.error('Error creating checkout session on GET:', err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?error=checkout_failed`);
    }
}
