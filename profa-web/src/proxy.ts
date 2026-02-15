import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Create client with manual cookie handling for middleware
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
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

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Route protection logic
    const path = request.nextUrl.pathname
    const isProtectedPath = path.startsWith('/app') || path.startsWith('/admin') || path.startsWith('/dashboard')

    if (isProtectedPath && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
    }

    // Admin protection (RBAC)
    if (user && (path.startsWith('/admin') || path.startsWith('/dashboard'))) {
        // We must verify if the user is actually an admin
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/app' // Redirect unauthorized users to student app
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}

export default async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
