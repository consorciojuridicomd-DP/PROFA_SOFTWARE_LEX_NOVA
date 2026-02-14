-- 05_admin_user_mgmt.sql
-- Phase 6+7: Admin Panel + DNI Auth

-- 1. Add DNI and is_active columns to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS dni TEXT UNIQUE;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- 2. RPC: Admin can toggle user active status
CREATE OR REPLACE FUNCTION public.toggle_user_active(
    p_user_id UUID,
    p_is_active BOOLEAN
)
RETURNS BOOLEAN AS $$
DECLARE
    v_caller_role TEXT;
BEGIN
    SELECT role INTO v_caller_role FROM public.user_profiles WHERE id = auth.uid();
    IF v_caller_role != 'admin' THEN
        RAISE EXCEPTION 'Only admin can toggle user status';
    END IF;
    UPDATE public.user_profiles 
    SET is_active = p_is_active, updated_at = NOW()
    WHERE id = p_user_id;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RPC: Admin get all users
CREATE OR REPLACE FUNCTION public.admin_get_users()
RETURNS JSONB AS $$
DECLARE
    v_caller_role TEXT;
    v_result JSONB;
BEGIN
    SELECT role INTO v_caller_role FROM public.user_profiles WHERE id = auth.uid();
    IF v_caller_role != 'admin' THEN
        RAISE EXCEPTION 'Only admin can list users';
    END IF;
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', up.id,
            'email', au.email,
            'full_name', up.full_name,
            'dni', up.dni,
            'contact_email', up.contact_email,
            'role', up.role,
            'is_active', up.is_active,
            'created_at', up.created_at
        ) ORDER BY up.created_at DESC
    ) INTO v_result
    FROM public.user_profiles up
    JOIN auth.users au ON up.id = au.id;
    RETURN COALESCE(v_result, '[]'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RPC: Admin change user role
CREATE OR REPLACE FUNCTION public.admin_set_role(
    p_user_id UUID,
    p_role TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_caller_role TEXT;
BEGIN
    SELECT role INTO v_caller_role FROM public.user_profiles WHERE id = auth.uid();
    IF v_caller_role != 'admin' THEN
        RAISE EXCEPTION 'Only admin can change roles';
    END IF;
    UPDATE public.user_profiles 
    SET role = p_role::user_role, updated_at = NOW()
    WHERE id = p_user_id;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RPC: Admin reject (delete) user request
CREATE OR REPLACE FUNCTION public.admin_reject_user(
    p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_caller_role TEXT;
BEGIN
    SELECT role INTO v_caller_role FROM public.user_profiles WHERE id = auth.uid();
    IF v_caller_role != 'admin' THEN
        RAISE EXCEPTION 'Only admin can reject users';
    END IF;
    DELETE FROM public.user_profiles WHERE id = p_user_id;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;