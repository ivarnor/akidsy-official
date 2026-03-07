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

        // 2. Check if user is a member
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_member')
            .eq('id', user.id)
            .single();

        if (profileError || !profile?.is_member) {
            return { url: null, error: 'Access Denied. Please check your subscription status.' };
        }

        // 3. Generate Signed URL
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);

        if (error || !data?.signedUrl) {
            console.error('Error generating signed URL:', error);
            return { url: null, error: 'Could not load asset. Please try again later.' };
        }

        return { url: data.signedUrl, error: null };
    } catch (err: any) {
        console.error('Unexpected error in getSignedUrl:', err);
        return { url: null, error: err.message || 'An unexpected error occurred.' };
    }
}
