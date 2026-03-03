import DashboardClientLayout from '@/src/components/DashboardClientLayout';
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

  const footerContent = (
    <footer className="mt-auto py-8 bg-navy text-white/50 text-center text-sm flex flex-col items-center gap-4 relative z-10 w-full">
      <div className="flex gap-4 md:gap-6 font-bold text-white/50 flex-wrap justify-center px-4">
        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
        <span className="hidden sm:inline">•</span>
        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        <span className="hidden sm:inline">•</span>
        <Link href="/account" className="hover:text-white transition-colors">Account</Link>
      </div>
      <p className="font-bold">© {new Date().getFullYear()} Akidsy • Happy Exploring! ✨</p>
    </footer>
  );

  return (
    <DashboardClientLayout footer={footerContent}>
      {children}
    </DashboardClientLayout>
  );
}
