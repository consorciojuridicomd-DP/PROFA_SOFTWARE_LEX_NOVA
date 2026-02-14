-- ==========================================
-- 🧹 LIMPIEZA TOTAL DE BASE DE DATOS
-- ==========================================
-- Pega esto en: Supabase > SQL Editor > Run
-- URL: https://supabase.com/dashboard/project/wvqqfdlhfyuaeemqfjwm/sql/new
-- ==========================================

-- PASO 1: Borrar TODOS los estudiantes de prueba de user_profiles
DELETE FROM public.user_profiles 
WHERE role = 'student';

-- PASO 2: Borrar el perfil admin duplicado (mantener solo 5f8472f3)
DELETE FROM public.user_profiles 
WHERE id = '4eb90905-32a9-4e60-8eea-8d5df0af09d6';

-- PASO 3: Corregir nombre del admin que queda
UPDATE public.user_profiles 
SET full_name = 'SERGIO JUVENAL DE LACRUZ ZUÑIGA',
    role = 'admin', 
    is_active = true, 
    updated_at = NOW()
WHERE id = '5f8472f3-2904-4f66-8471-6b08c43190df';

-- PASO 4: Limpiar auth.users de prueba
DELETE FROM auth.users 
WHERE id != '5f8472f3-2904-4f66-8471-6b08c43190df'
  AND id != '4eb90905-32a9-4e60-8eea-8d5df0af09d6';

-- PASO 5: Borrar auth.user duplicado del admin
DELETE FROM auth.users 
WHERE id = '4eb90905-32a9-4e60-8eea-8d5df0af09d6';

-- PASO 6: Recrear RPCs (SECURITY DEFINER - bypasan RLS)
CREATE OR REPLACE FUNCTION public.toggle_user_active(
    p_user_id UUID,
    p_is_active BOOLEAN
) RETURNS BOOLEAN AS $$
DECLARE v_role TEXT;
BEGIN
    SELECT role INTO v_role FROM public.user_profiles WHERE id = auth.uid();
    IF v_role != 'admin' THEN RAISE EXCEPTION 'Solo admin'; END IF;
    UPDATE public.user_profiles 
    SET is_active = p_is_active, updated_at = NOW()
    WHERE id = p_user_id;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.admin_reject_user(
    p_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE v_role TEXT;
BEGIN
    SELECT role INTO v_role FROM public.user_profiles WHERE id = auth.uid();
    IF v_role != 'admin' THEN RAISE EXCEPTION 'Solo admin'; END IF;
    DELETE FROM public.user_profiles WHERE id = p_user_id;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.admin_get_users()
RETURNS JSONB AS $$
DECLARE v_role TEXT; v_result JSONB;
BEGIN
    SELECT role INTO v_role FROM public.user_profiles WHERE id = auth.uid();
    IF v_role != 'admin' THEN RAISE EXCEPTION 'Solo admin'; END IF;
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', up.id, 'email', au.email,
            'full_name', up.full_name, 'dni', up.dni,
            'role', up.role, 'is_active', up.is_active,
            'created_at', up.created_at
        ) ORDER BY up.created_at DESC
    ) INTO v_result
    FROM public.user_profiles up
    JOIN auth.users au ON up.id = au.id;
    RETURN COALESCE(v_result, '[]'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 7: Verificar resultado
SELECT '✅ LIMPIEZA COMPLETADA' as resultado;
SELECT id, full_name, role, is_active FROM public.user_profiles;
