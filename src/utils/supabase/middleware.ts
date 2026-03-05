import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // This will refresh session if expired - required for Server Components
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const isPublicRoute =
        request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname === '/terms' ||
        request.nextUrl.pathname === '/privacy' ||
        request.nextUrl.pathname === '/sitemap.xml' ||
        request.nextUrl.pathname === '/robots.txt' ||
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/auth') ||
        request.nextUrl.pathname.startsWith('/api/checkout')

    // Protect all non-public routes
    // Special case: If user is coming from Stripe with a session_id, allow them to reach the dashboard
    // they will be refreshed on the client side
    const hasStripeSession = request.nextUrl.searchParams.has('session_id');
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

    if (!user && !isPublicRoute && !(isDashboard && hasStripeSession)) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Admin route protection: Kick non-admins out of the admin panel
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user || user.email !== 'ivarnor@gmail.com') {
            const url = request.nextUrl.clone()
            url.pathname = '/'
            url.searchParams.set('error', 'unauthorized')
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
