import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client — uses SERVICE_ROLE_KEY.
 * This bypasses ALL Row Level Security (RLS).
 * ONLY use this on the SERVER SIDE (API routes, Server Actions).
 * NEVER import this file from client components.
 */
export function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!serviceKey) {
        throw new Error(
            'SUPABASE_SERVICE_ROLE_KEY is missing from .env.local. ' +
            'Get it from: Supabase Dashboard > Settings > API > service_role key'
        )
    }

    return createClient(url, serviceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
