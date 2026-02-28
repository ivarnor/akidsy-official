import DashboardHeader from '@/src/components/DashboardHeader';
import Link from 'next/link';

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

  const isVIP = user.email === 'ivarnor@gmail.com';

  if (!isVIP && !profile?.is_member) {
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
      <footer className="mt-auto py-8 bg-navy text-white/50 text-center text-sm border-t-4 border-navy flex flex-col items-center gap-4">
        <div className="flex gap-6 font-bold text-white/50">
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <span>•</span>
          <Link href="/account" className="hover:text-white transition-colors">Account</Link>
          <span>•</span>
          <Link href="/dashboard/parent" className="hover:text-white transition-colors flex items-center gap-1">
            <span aria-hidden="true">⚙️</span>
            Parent Dashboard
          </Link>
        </div>
        <p className="font-bold">© {new Date().getFullYear()} Akidsy • Happy Exploring! ✨</p>
      </footer>
    </div>
  );
}
