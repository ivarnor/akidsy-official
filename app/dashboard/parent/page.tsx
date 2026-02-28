import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ParentSettingsClient } from './ParentSettingsClient';

export default async function ParentDashboardPage() {
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

    if (!profile) {
        redirect('/dashboard');
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-navy tracking-tight mb-2">⚙️ Parent Dashboard</h1>
                    <p className="text-navy/70 text-lg font-medium">Manage what content your child can see and view their recent activity.</p>
                </div>
                <a href="/dashboard" className="px-6 py-2 rounded-full border-4 border-navy bg-cream font-bold text-navy hover:bg-sky transition-colors flex items-center gap-2 shadow-[2px_2px_0px_0px_#1C304A] active:translate-y-0.5 active:shadow-none whitespace-nowrap">
                    Back to Kids Mode
                </a>
            </div>

            <ParentSettingsClient profile={profile} />
        </div>
    );
}
