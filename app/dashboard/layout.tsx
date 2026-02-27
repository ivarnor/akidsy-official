import DashboardHeader from '@/src/components/DashboardHeader';

import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?message=Please log in to see this content!');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_member, subscription_status')
    .eq('id', user.id)
    .single();

  if (!profile?.is_member && profile?.subscription_status !== 'trialing' && profile?.subscription_status !== 'active') {
    redirect('/?message=Please join the club to see this content!');
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col font-sans">
      <DashboardHeader />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-navy text-white/50 text-center font-bold text-sm border-t-4 border-navy">
        <p>© {new Date().getFullYear()} Akidsy • Happy Exploring! ✨</p>
      </footer>
    </div>
  );
}
