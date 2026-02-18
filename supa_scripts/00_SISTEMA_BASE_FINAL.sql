-- ==========================================
-- SISTEMA BASE FINAL: AUTH & ADMIN CONSOLIDADO
-- Módulo: Gestión de Usuarios y Seguridad Lex Nova
-- ==========================================

BEGIN;

-- 1. TIPOS Y ENUMS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('student', 'admin');
    END IF;
END $$;

-- 2. TABLA DE PERFILES
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    dni TEXT UNIQUE,
    full_name TEXT,
    role public.user_role DEFAULT 'student'::public.user_role,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SEGURIDAD (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura perfil propio" ON public.user_profiles;
CREATE POLICY "Lectura perfil propio" ON public.user_profiles 
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin gestiona todo" ON public.user_profiles;
CREATE POLICY "Admin gestiona todo" ON public.user_profiles 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 4. TRIGGER DE SINCRONIZACIÓN (MASTER)
-- REPARACIÓN: Se califica public.user_role para evitar errores de búsqueda de esquema.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, dni, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'dni', ''),
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role)
  )
  ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    dni = EXCLUDED.dni;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. FUNCIONES DE ADMINISTRACIÓN RPC
CREATE OR REPLACE FUNCTION public.admin_get_users()
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    dni TEXT,
    role public.user_role,
    is_active BOOLEAN,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin') THEN
        RETURN QUERY 
        SELECT up.id, up.email, up.full_name, up.dni, up.role, up.is_active, up.created_at
        FROM public.user_profiles up
        ORDER BY up.created_at DESC;
    ELSE
        RAISE EXCEPTION 'Acceso denegado.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.toggle_user_active(p_user_id UUID, p_is_active BOOLEAN)
RETURNS VOID AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin') THEN
        UPDATE public.user_profiles SET is_active = p_is_active, updated_at = NOW() WHERE id = p_user_id;
    ELSE
        RAISE EXCEPTION 'No autorizado.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.admin_reject_user(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin') THEN
        DELETE FROM public.user_profiles WHERE id = p_user_id;
    ELSE
        RAISE EXCEPTION 'No autorizado.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
