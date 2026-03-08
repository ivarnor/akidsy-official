'use server';

import { createClient } from './server';

export async function getSignedUrl(bucket: string, path: string, expiresIn: number = 3600) {
    try {
        const supabase = await createClient();

        // 1. Verify user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { url: null, error: 'Not authenticated' };
        }

        // 2. Check if user is a member (Admin Bypass included)
        if (user.email === 'ivarnor@gmail.com') {
            console.log('Admin bypass triggered for:', user.email);
        } else {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('is_member')
                .eq('id', user.id)
                .single();

            if (profileError || !profile?.is_member) {
                return { url: null, error: 'Access Denied. Please check your subscription status.' };
            }
        }

        // 3. Generate Signed URL
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);

        if (error || !data?.signedUrl) {
            console.error('Error generating signed URL:', error);
            return null;
        }

        return data.signedUrl;
    } catch (err: any) {
        console.error('Unexpected error in getSignedUrl:', err);
        return null;
    }
}
