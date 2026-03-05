import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/src/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    // If coming from Stripe, allow them to reach the dashboard or success page so the client-side session can initialize
    if ((request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/checkout/success')) && request.nextUrl.searchParams.has('session_id')) {
        return NextResponse.next()
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api (API routes, except webhooks which may be protected depending on needs)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|api/webhooks/stripe|.*\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|ogg)$).*)',
    ],
}
