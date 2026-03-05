import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/src/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && session?.user) {
            // First check for Admin
            if (session.user.email === 'ivarnor@gmail.com') {
                return NextResponse.redirect(`${origin}/admin`)
            }

            // Normal User: check if member
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_member')
                .eq('id', session.user.id)
                .single()

            if (!profile?.is_member) {
                // Not paid/trialed yet -> force Stripe Checkout
                // We do a GET redirect so their browser navigates to the checkout creator
                return NextResponse.redirect(`https://www.akidsy.com/api/checkout`)
            }

            // Already a member? Send them to next/dashboard
            return NextResponse.redirect(`https://www.akidsy.com${next}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`https://www.akidsy.com/login?message=Could not verify your identity`)
}
