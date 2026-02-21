-- 05_IA_FALLBACK_FIX.sql
-- Este script habilita el conteo verídico de preguntas y soluciona el error de filtrado por temas.

-- 1. Asegurar columna questions_gap para rastreo de fallback
ALTER TABLE public.intentos 
ADD COLUMN IF NOT EXISTS questions_gap INT DEFAULT 0;

-- 2. RPC: count_available_questions (Soluciona el error "Sin preguntas")
CREATE OR REPLACE FUNCTION public.count_available_questions(p_topics JSONB DEFAULT '[]'::JSONB)
RETURNS JSONB AS $$
DECLARE
    v_total INT;
    v_by_topic JSONB;
    v_topics_len INT;
BEGIN
    v_topics_len := jsonb_array_length(p_topics);

    -- Conteo Total
    SELECT COUNT(*) INTO v_total
    FROM public.preguntas q
    JOIN public.materias m ON q.materia_id = m.id
    WHERE q.estado = 'active'
      AND (v_topics_len = 0 OR m.nombre IN (SELECT jsonb_array_elements_text(p_topics)));

    -- Conteo por Tema (para la UI)
    SELECT jsonb_object_agg(topic_name, topic_count) INTO v_by_topic
    FROM (
        SELECT m.nombre as topic_name, COUNT(*) as topic_count
        FROM public.preguntas q
        JOIN public.materias m ON q.materia_id = m.id
        WHERE q.estado = 'active'
          AND (v_topics_len = 0 OR m.nombre IN (SELECT jsonb_array_elements_text(p_topics)))
        GROUP BY m.nombre
    ) t;

    RETURN jsonb_build_object(
        'total', COALESCE(v_total, 0),
        'byTopic', COALESCE(v_by_topic, '{}'::JSONB)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RPC: start_session (Corregido para filtrar por NOMBRE de materia)
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
    v_topics_len INT;
    v_found_count INT;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

    -- Límite solicitado
    v_limit := (p_config->>'questionCount')::INT;
    IF v_limit IS NULL OR v_limit <= 0 THEN v_limit := 30; END IF;

    -- Duración
    IF p_examen_id IS NOT NULL THEN
        SELECT duracion_min INTO v_duration FROM public.examenes WHERE id = p_examen_id;
    ELSE
        v_duration := (p_config->>'durationMinutes')::INT;
    END IF;
    IF v_duration IS NULL THEN v_duration := 60; END IF;

    -- Modo
    IF p_examen_id IS NOT NULL THEN
        v_modo := 'simulacro'::exam_mode;
    ELSE
        v_topics_len := COALESCE(jsonb_array_length(p_config->'topics'), 0);
        v_modo := CASE WHEN v_topics_len > 0 THEN 'materia'::exam_mode ELSE 'personalizado'::exam_mode END;
    END IF;

    -- Crear intento
    INSERT INTO public.intentos (examen_id, user_id, started_at, ends_at, estado, modo, config, questions_gap)
    VALUES (
        p_examen_id,
        v_user_id,
        NOW(),
        NOW() + (v_duration || ' minutes')::INTERVAL,
        'in_progress'::session_status,
        v_modo,
        p_config,
        0
    )
    RETURNING id INTO v_intento_id;

    -- Poblar preguntas (Corregido: JOIN con materias para filtrar por nombre)
    IF p_examen_id IS NOT NULL THEN
        INSERT INTO public.session_questions (intento_id, pregunta_id, orden)
        SELECT v_intento_id, pregunta_id, orden
        FROM public.examen_preguntas
        WHERE examen_id = p_examen_id;
        GET DIAGNOSTICS v_found_count = ROW_COUNT;
    ELSE
        INSERT INTO public.session_questions (intento_id, pregunta_id, orden)
        SELECT v_intento_id, id, row_number() OVER (ORDER BY RANDOM())
        FROM public.preguntas q
        JOIN public.materias m ON q.materia_id = m.id
        WHERE q.estado = 'active'
          AND (v_topics_len = 0 OR m.nombre IN (SELECT jsonb_array_elements_text(p_config->'topics')))
        LIMIT v_limit;
        GET DIAGNOSTICS v_found_count = ROW_COUNT;
    END IF;

    -- Registrar el GAP para que el frontend sepa que debe completar con IA
    IF v_found_count < v_limit AND p_examen_id IS NULL THEN
        UPDATE public.intentos SET questions_gap = v_limit - v_found_count WHERE id = v_intento_id;
    END IF;

    RETURN v_intento_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
