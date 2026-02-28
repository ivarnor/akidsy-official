import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?message=Please log in to access the admin portal');
    }

    if (user.email !== 'ivarnor@gmail.com') {
        redirect('/dashboard?message=You do not have permission to view that page');
    }

    return <>{children}</>;
}
