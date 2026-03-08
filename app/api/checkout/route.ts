import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@/src/utils/supabase/server'; // Server component to check current logged-in user

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Price MAP for manual ID mapping
const PRICE_MAP: Record<string, string> = {
    'monthly': 'price_1T6xtSC1HhLD0dXE1w7OCgK2',
    'yearly': 'price_1T6xwUC1HhLD0dXEgMU4i54M'
};

// Standard site configuration (Always use the newest Monthly ID as default)
const DEFAULT_PRICE_ID = 'price_1T6xtSC1HhLD0dXE1w7OCgK2';

// The POST handler works well for manual checkout requests passed from client components
export async function POST(req: Request) {
    try {
        const { priceId, userEmail, userId } = await req.json();

        // Use map to get real priceId if passing "monthly" or "yearly", fallback to passed ID
        const actualPriceId = PRICE_MAP[priceId] || priceId;

        // Optional log for debugging
        console.log('Original Price ID Request:', priceId, 'Mapped Price ID:', actualPriceId);

        if (!actualPriceId || !userEmail || !userId) {
            return NextResponse.json({ error: 'Missing priceId, userEmail, or userId' }, { status: 400 });
        }

        const isYearly = priceId === 'yearly' || actualPriceId === PRICE_MAP['yearly'];
        const nextPath = isYearly ? '/dashboard?welcome=yearly' : '/dashboard';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            payment_method_collection: 'always',
            allow_promotion_codes: true,
            line_items: [
                {
                    price: actualPriceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            subscription_data: {
                trial_period_days: 7,
                metadata: {
                    price_id: actualPriceId
                }
            },
            metadata: {
                price_id: actualPriceId
            },
            success_url: `https://www.akidsy.com/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://www.akidsy.com/?canceled=true`,
            customer_email: userEmail,
            client_reference_id: userId, // Supabase user linking
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
        const { data: { session: authSession } } = await supabase.auth.getSession();

        const user = authSession?.user;

        if (!user || !user.email) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login?message=Please log in to checkout`);
        }

        // Check if user is already a member before creating a session
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_member, stripe_customer_id')
            .eq('id', user.id)
            .maybeSingle();

        if (profile?.is_member || profile?.stripe_customer_id) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`);
        }

        // Note: GET handler currently uses DEFAULT_PRICE_ID (monthly)
        // If we want to support yearly via GET in the future, we'd need a way to pass the intent.
        const nextPath = '/dashboard';

        const stripeSession = await stripe.checkout.sessions.create({
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
            success_url: `https://www.akidsy.com/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://www.akidsy.com/?canceled=true`,
            customer_email: user.email,
            client_reference_id: user.email,
        });

        // 303 See Other is optimal for navigating the browser to Stripe
        return NextResponse.redirect(stripeSession.url as string, 303);
    } catch (err: any) {
        console.error('Error creating checkout session on GET:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
