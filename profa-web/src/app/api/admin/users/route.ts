import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'

/**
 * GET /api/admin/users — List ALL users via RPC (SECURITY DEFINER, bypasses RLS)
 */
export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

        // Use admin_get_users RPC — SECURITY DEFINER, bypasses RLS
        const { data, error } = await supabase.rpc('admin_get_users')

        if (error) {
            console.error('RPC admin_get_users error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Filter only inactive (pending) users
        const allUsers = data || []
        const pending = allUsers.filter((u: any) => u.is_active === false)

        return NextResponse.json({ users: pending })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

/**
 * PATCH /api/admin/users — Activate/Deactivate a user
 * Body: { userId: string, isActive: boolean }
 * Uses toggle_user_active RPC (SECURITY DEFINER)
 */
export async function PATCH(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

        const body = await req.json()
        const { userId, isActive } = body
        if (!userId) return NextResponse.json({ error: 'userId requerido' }, { status: 400 })

        const { data, error } = await supabase.rpc('toggle_user_active', {
            p_user_id: userId,
            p_is_active: isActive,
        })

        if (error) {
            console.error('RPC toggle_user_active error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

/**
 * DELETE /api/admin/users — Delete a user completely
 * Body: { userId: string }
 * Uses admin_reject_user RPC (SECURITY DEFINER)
 */
export async function DELETE(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

        const body = await req.json()
        const { userId } = body
        if (!userId) return NextResponse.json({ error: 'userId requerido' }, { status: 400 })

        const { data, error } = await supabase.rpc('admin_reject_user', {
            p_user_id: userId,
        })

        if (error) {
            console.error('RPC admin_reject_user error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
