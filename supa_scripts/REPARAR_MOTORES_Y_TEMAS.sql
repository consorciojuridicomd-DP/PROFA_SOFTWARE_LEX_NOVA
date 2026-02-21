-- ==============================================================================
-- REPARAR_MOTORES_Y_TEMAS.sql
-- SOLUCIÓN INTEGRAL: Filtrado Estricto + Limpieza + Acceso LEO DANIEL
-- ==============================================================================

-- 1. LIMPIEZA DE FUNCIONES REDUNDANTES (Evitar conflictos)
DROP FUNCTION IF EXISTS public.count_available_questions(JSONB);
DROP FUNCTION IF EXISTS public.start_session(UUID, JSONB);

-- 2. FUNCIÓN: count_available_questions (Filtrado Profesional)
-- Propósito: Contar preguntas SOLO de los temas seleccionados. No mezcla.
CREATE OR REPLACE FUNCTION public.count_available_questions(p_topics JSONB DEFAULT '[]'::JSONB)
RETURNS JSONB AS $$
DECLARE
    v_total INT;
    v_by_topic JSONB;
    v_topics_len INT;
    v_topic_names TEXT[];
BEGIN
    v_topics_len := jsonb_array_length(p_topics);
    
    -- Convertir JSONB array a TEXT[] para filtrado estricto
    SELECT ARRAY_AGG(x) INTO v_topic_names 
    FROM jsonb_array_elements_text(p_topics) x;

    -- Conteo Total Riguroso por tema
    IF v_topics_len = 0 THEN
        SELECT COUNT(*) INTO v_total
        FROM public.preguntas q
        WHERE q.estado = 'active';
    ELSE
        SELECT COUNT(*) INTO v_total
        FROM public.preguntas q
        JOIN public.materias m ON q.materia_id = m.id
        WHERE q.estado = 'active'
          AND m.nombre = ANY(v_topic_names);
    END IF;

    -- Conteo por Tema individual
    SELECT jsonb_object_agg(topic_name, topic_count) INTO v_by_topic
    FROM (
        SELECT m.nombre as topic_name, COUNT(*) as topic_count
        FROM public.preguntas q
        JOIN public.materias m ON q.materia_id = m.id
        WHERE q.estado = 'active'
          AND (v_topics_len = 0 OR m.nombre = ANY(v_topic_names))
        GROUP BY m.nombre
    ) t;

    RETURN jsonb_build_object(
        'total', COALESCE(v_total, 0),
        'byTopic', COALESCE(v_by_topic, '{}'::JSONB)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. FUNCIÓN: start_session (Sincronización Total)
-- Propósito: Iniciar sesión garantizando que las preguntas sean del tema exacto.
CREATE OR REPLACE FUNCTION public.start_session(
    p_examen_id UUID,
    p_config    JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID AS $$
DECLARE
    v_intento_id UUID;
    v_user_id    UUID;
    v_limit      INT;
    v_duration   INT;
    v_modo       exam_mode;
    v_topic_names TEXT[];
    v_found_count INT;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

    -- Extraer configuración
    v_limit := (p_config->>'questionCount')::INT;
    IF v_limit IS NULL OR v_limit <= 0 THEN v_limit := 30; END IF;

    v_duration := (p_config->>'durationMinutes')::INT;
    IF v_duration IS NULL THEN v_duration := 60; END IF;

    SELECT ARRAY_AGG(x) INTO v_topic_names 
    FROM jsonb_array_elements_text(p_config->'topics') x;

    -- Determinar modo
    IF p_examen_id IS NOT NULL THEN
        v_modo := 'simulacro'::exam_mode;
    ELSE
        v_modo := 'materia'::exam_mode;
    END IF;

    -- Crear Intento
    INSERT INTO public.intentos (examen_id, user_id, started_at, ends_at, estado, modo, config)
    VALUES (
        p_examen_id,
        v_user_id,
        NOW(),
        NOW() + (v_duration || ' minutes')::INTERVAL,
        'in_progress'::session_status,
        v_modo,
        p_config
    )
    RETURNING id INTO v_intento_id;

    -- Poblado de preguntas: FILTRADO ESTRICTO
    IF p_examen_id IS NOT NULL THEN
        INSERT INTO public.session_questions (intento_id, pregunta_id, orden)
        SELECT v_intento_id, pregunta_id, orden
        FROM public.examen_preguntas
        WHERE examen_id = p_examen_id;
    ELSE
        INSERT INTO public.session_questions (intento_id, pregunta_id, orden)
        SELECT v_intento_id, q.id, row_number() OVER (ORDER BY RANDOM())
        FROM public.preguntas q
        JOIN public.materias m ON q.materia_id = m.id
        WHERE q.estado = 'active'
          AND (v_topic_names IS NULL OR m.nombre = ANY(v_topic_names))
        LIMIT v_limit;
    END IF;

    RETURN v_intento_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. ACCESO LEO DANIEL: Corrección Integral
DO $$
DECLARE
    v_leo_id UUID := gen_random_uuid();
    v_email TEXT := 'leo@gmail.com';
BEGIN
    -- Limpiar registros basura
    DELETE FROM public.user_profiles WHERE email = v_email;
    DELETE FROM auth.users WHERE email = v_email;

    -- Crear en Auth
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (
        v_leo_id,
        '00000000-0000-0000-0000-000000000000',
        v_email,
        crypt('123456', gen_salt('bf')),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "LEO DANIEL", "role": "student", "dni": "123456"}',
        'authenticated',
        'authenticated'
    );

    -- Crear en Profile (Por si el trigger falla o no existe)
    INSERT INTO public.user_profiles (id, email, dni, full_name, role, is_active)
    VALUES (v_leo_id, v_email, '123456', 'LEO DANIEL', 'student', true)
    ON CONFLICT (id) DO UPDATE SET is_active = true, role = 'student';
END $$;
