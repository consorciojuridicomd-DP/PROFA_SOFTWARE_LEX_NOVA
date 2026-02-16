-- SCRIPT DE PURGA DE DATOS (LIMPIEZA TOTAL DE USUARIOS)
-- Ejecutar en el SQL Editor de Supabase

-- 1. Eliminar perfiles de usuario (tabla pública)
DELETE FROM public.user_profiles;

-- 2. Eliminar sesiones e intentos (para evitar errores de FK)
DELETE FROM public.session_questions;
DELETE FROM public.intentos;

-- 3. Eliminar usuarios de autenticación (requiere permisos de admin)
-- Nota: En Supabase, esto suele hacerse desde el dashboard o con una función especial.
-- Si tienes acceso a la tabla auth.users:
DELETE FROM auth.users WHERE email LIKE '%@lexnova.app';

-- Reiniciar secuencias si es necesario
-- ALTER SEQUENCE public.user_profiles_id_seq RESTART WITH 1;
