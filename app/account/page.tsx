import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/src/components/DashboardHeader';
import { AccountManagementClient } from './AccountManagementClient';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover',
});

export default async function AccountPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?message=Please log in to manage your account');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    let planName = 'Free/No Active Subscription';
    const isVIP = user.email === 'ivarnor@gmail.com';

    // Fetch the specific Stripe plan if they have a customer ID
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
                planName = interval === 'year' ? 'Yearly Membership' : 'Monthly Membership';
            } else {
                // Try trialing status
                const trials = await stripe.subscriptions.list({
                    customer: profile.stripe_customer_id,
                    status: 'trialing',
                    limit: 1,
                });
                if (trials.data.length > 0) {
                    const sub = trials.data[0];
                    const interval = sub.items.data[0].plan.interval;
                    planName = interval === 'year' ? 'Yearly Membership (Trialing)' : 'Monthly Membership (Trialing)';
                }
            }
        } catch (e) {
            console.error("Error fetching stripe plan", e);
        }
    } else if (isVIP) {
        planName = 'Lifetime VIP Access';
    }

    const memberSince = new Date(profile?.created_at || user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
            <DashboardHeader />

            <main className="flex-1 p-6 md:p-10 flex items-center justify-center">
                <div className="w-full max-w-2xl">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_0px_#1C304A] border-4 border-navy">
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl md:text-5xl font-black text-navy tracking-tight mb-4">Account Settings</h1>
                            <p className="text-navy/70 text-lg">Manage your membership and billing details.</p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-cream/50 rounded-2xl p-6 border-2 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-bold text-navy/50 uppercase tracking-wider mb-1">Email Address</p>
                                    <p className="text-xl font-bold text-navy">{user.email}</p>
                                </div>
                            </div>

                            <div className="bg-cream/50 rounded-2xl p-6 border-2 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-bold text-navy/50 uppercase tracking-wider mb-1">Member Since</p>
                                    <p className="text-xl font-bold text-navy">{memberSince}</p>
                                </div>
                            </div>

                            <div className="bg-sky/5 rounded-2xl p-6 border-2 border-sky/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-bold text-sky uppercase tracking-wider mb-1">Current Plan</p>
                                    <p className="text-xl font-bold text-navy">{planName}</p>
                                </div>
                                <div className="text-right">
                                    <AccountManagementClient userEmail={user.email || ''} isVIP={isVIP} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <a href="/dashboard" className="text-navy/60 hover:text-navy font-bold transition-colors underline decoration-2 underline-offset-4">
                                ← Back to Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
