-- 07_CREAR_USUARIO_PRUEBAS_LEO.sql
-- VERSIÓN DEFINITIVA: Crea Auth + Profile coordinadamente

DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
    v_email TEXT := 'leo@gmail.com';
    v_password TEXT := '123456';
    v_dni TEXT := '123456';
    v_full_name TEXT := 'LEO DANIEL';
BEGIN
    -- 1. Limpieza total para evitar duplicados
    DELETE FROM public.user_profiles WHERE email = v_email;
    DELETE FROM auth.users WHERE email = v_email;

    -- 2. Inserción en la tabla de Autenticación de Supabase
    -- Se usa pgcrypto para cifrar la clave con el estándar BCrypt
    INSERT INTO auth.users (
        id,
        instance_id, 
        email, 
        encrypted_password, 
        email_confirmed_at, 
        raw_app_meta_data, 
        raw_user_meta_data, 
        is_super_admin, 
        role,
        created_at,
        updated_at,
        aud
    )
    VALUES (
        v_user_id,
        '00000000-0000-0000-0000-000000000000',
        v_email,
        crypt(v_password, gen_salt('bf')),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object('full_name', v_full_name, 'role', 'student', 'dni', v_dni),
        false,
        'authenticated',
        now(),
        now(),
        'authenticated'
    );

    -- 3. Inserción en el Perfil Público (Con ON CONFLICT por si hay triggers)
    INSERT INTO public.user_profiles (
        id, 
        email, 
        dni, 
        full_name, 
        role, 
        is_active
    ) 
    VALUES (
        v_user_id, 
        v_email, 
        v_dni, 
        v_full_name, 
        'student', 
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        dni = EXCLUDED.dni,
        full_name = EXCLUDED.full_name,
        is_active = true,
        role = EXCLUDED.role;

    RAISE NOTICE 'ALUMNO % CREADO CON ÉXITO. PIN ACCESO: %', v_full_name, v_password;
END $$;

