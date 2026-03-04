import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import SupportClient from './SupportClient';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover',
});

export default async function SupportPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?message=Please log in to contact support');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    let isYearly = false;
    const isVIP = user.email === 'ivarnor@gmail.com';

    if (!isVIP && profile?.stripe_customer_id) {
        try {
            const subscriptions = await stripe.subscriptions.list({
                customer: profile.stripe_customer_id,
                status: 'active',
                limit: 1,
            });

            if (subscriptions.data.length > 0) {
                const sub = subscriptions.data[0];
                const interval = sub.items.data[0].plan.interval;
                if (interval === 'year') isYearly = true;
            } else {
                const trials = await stripe.subscriptions.list({
                    customer: profile.stripe_customer_id,
                    status: 'trialing',
                    limit: 1,
                });
                if (trials.data.length > 0) {
                    const sub = trials.data[0];
                    const interval = sub.items.data[0].plan.interval;
                    if (interval === 'year') isYearly = true;
                }
            }
        } catch (e) {
            console.error("Error fetching stripe plan", e);
        }
    } else if (isVIP) {
        // VIP treated as yearly for priority features
        isYearly = true;
    }

    return <SupportClient isYearly={isYearly} />;
}
