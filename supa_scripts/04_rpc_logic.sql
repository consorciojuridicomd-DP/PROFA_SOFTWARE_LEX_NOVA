-- 04_rpc_logic.sql

-- 1. FIX: Add session_questions table (missed in initial schema)
CREATE TABLE IF NOT EXISTS public.session_questions (
    intento_id UUID REFERENCES public.intentos(id) ON DELETE CASCADE,
    pregunta_id UUID REFERENCES public.preguntas(id) ON DELETE CASCADE,
    orden INT NOT NULL,
    PRIMARY KEY (intento_id, pregunta_id)
);

ALTER TABLE public.session_questions ENABLE ROW LEVEL SECURITY;

-- RLS for session_questions
DROP POLICY IF EXISTS "Users read own session questions" ON public.session_questions;
CREATE POLICY "Users read own session questions" ON public.session_questions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.intentos i WHERE i.id = session_questions.intento_id AND i.user_id = auth.uid()
  )
);

-- 2. RPC: start_session
-- Crea un intento, selecciona preguntas (aleatoriamente o desde un examen fijo),
-- y puebla session_questions. Determina el modo correctamente (enum exam_mode).
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
    v_modo       exam_mode;   -- Tipado como enum, NO como TEXT
    v_topics_len INT;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

    -- Determinar duración
    IF p_examen_id IS NOT NULL THEN
        SELECT duracion_min INTO v_duration FROM public.examenes WHERE id = p_examen_id;
        IF v_duration IS NULL THEN v_duration := 60; END IF;
    ELSE
        v_duration := (p_config->>'durationMinutes')::INT;
        IF v_duration IS NULL THEN v_duration := 60; END IF;
    END IF;

    -- Determinar modo (enum exam_mode exacto: simulacro | materia | personalizado)
    IF p_examen_id IS NOT NULL THEN
        v_modo := 'simulacro'::exam_mode;
    ELSE
        v_topics_len := COALESCE(jsonb_array_length(p_config->'topics'), 0);
        IF v_topics_len > 0 THEN
            v_modo := 'materia'::exam_mode;
        ELSE
            v_modo := 'personalizado'::exam_mode;
        END IF;
    END IF;

    -- Insertar intento (ends_at y config son los nombres reales en la DB)
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

    -- Seleccionar preguntas
    IF p_examen_id IS NOT NULL THEN
        -- Modo simulacro: preguntas del examen fijo
        INSERT INTO public.session_questions (intento_id, pregunta_id, orden)
        SELECT v_intento_id, pregunta_id, orden
        FROM public.examen_preguntas
        WHERE examen_id = p_examen_id;
    ELSE
        -- Modo materia o personalizado: selección dinámica aleatoria
        v_limit := (p_config->>'questionCount')::INT;
        IF v_limit IS NULL OR v_limit <= 0 THEN v_limit := 30; END IF;

        INSERT INTO public.session_questions (intento_id, pregunta_id, orden)
        SELECT v_intento_id, id, row_number() OVER (ORDER BY RANDOM())
        FROM public.preguntas q
        WHERE
            q.estado = 'active'
            AND (
                v_topics_len = 0
                OR q.materia_id::text IN (
                    SELECT jsonb_array_elements_text(p_config->'topics')
                )
            )
        LIMIT v_limit;
    END IF;

    RETURN v_intento_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. RPC: get_session_questions
-- Returns questions for the session without disclosing is_correct
-- Also returns options.
-- We return a JSON structure to make it easier for frontend? Or just rows?
-- Let's return rows of questions, frontend fetches options? 
-- Or return a composite JSON.
CREATE OR REPLACE FUNCTION public.get_session_questions(p_intento_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_result JSONB;
BEGIN
    v_user_id := auth.uid();
    
    -- Verify ownership
    PERFORM 1 FROM public.intentos WHERE id = p_intento_id AND user_id = v_user_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Session not found or access denied'; END IF;

    SELECT jsonb_agg(
        jsonb_build_object(
            'id', q.id,
            'stem', q.enunciado,
            'tipo', q.tipo,
            'dificultad', q.dificultad,
            'category', m.nombre, -- Added category
            'source', q.fuente_bibliografica,
            'sourceUrl', q.url_fuente,
            'orden', sq.orden,
            'options', ( -- Renamed for frontend consistency
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', a.id,
                        'text', a.texto,
                        'orden', a.orden
                    ) ORDER BY a.orden
                )
                FROM public.alternativas a
                WHERE a.pregunta_id = q.id
            )
        ) ORDER BY sq.orden
    ) INTO v_result
    FROM public.session_questions sq
    JOIN public.preguntas q ON sq.pregunta_id = q.id
    LEFT JOIN public.materias m ON q.materia_id = m.id -- Join materia
    WHERE sq.intento_id = p_intento_id;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RPC: submit_answer
CREATE OR REPLACE FUNCTION public.submit_answer(
    p_intento_id UUID,
    p_pregunta_id UUID,
    p_alternativa_id UUID
)
RETURNS BOOLEAN AS $$
    DECLARE
        v_user_id UUID;
        v_es_correcta BOOLEAN;
        v_ended_at TIMESTAMPTZ;
        v_estado TEXT;
    BEGIN
        v_user_id := auth.uid();
    
        -- Verify session ownership, time, AND STATUS
        SELECT ended_at, estado INTO v_ended_at, v_estado 
        FROM public.intentos 
        WHERE id = p_intento_id AND user_id = v_user_id;
        
        IF NOT FOUND THEN RAISE EXCEPTION 'Session not found'; END IF;
        
        IF v_estado != 'in_progress' THEN
             RAISE EXCEPTION 'Session is closed (Status: %)', v_estado;
        END IF;

        IF NOW() > v_ended_at THEN 
             -- Close session if expired
             UPDATE public.intentos SET estado = 'expired', completed_at = NOW() WHERE id = p_intento_id;
             RAISE EXCEPTION 'Time expired'; 
        END IF;

    -- Check if correct
    SELECT es_correcta INTO v_es_correcta FROM public.alternativas WHERE id = p_alternativa_id AND pregunta_id = p_pregunta_id;

    -- Upsert response
    INSERT INTO public.respuestas (intento_id, pregunta_id, alternativa_id, es_correcta, responded_at)
    VALUES (p_intento_id, p_pregunta_id, p_alternativa_id, v_es_correcta, NOW())
    ON CONFLICT (intento_id, pregunta_id) 
    DO UPDATE SET 
        alternativa_id = EXCLUDED.alternativa_id,
        es_correcta = EXCLUDED.es_correcta,
        responded_at = NOW();
        
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RPC: finish_session
CREATE OR REPLACE FUNCTION public.finish_session(p_intento_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_score NUMERIC;
    v_total_correct INT;
    v_total_incorrect INT;
    v_total_questions INT;
BEGIN
    v_user_id := auth.uid();
    
    -- Verify ownership
    PERFORM 1 FROM public.intentos WHERE id = p_intento_id AND user_id = v_user_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Session not found'; END IF;

    -- Calculate stats
    SELECT 
        COUNT(*) FILTER (WHERE es_correcta = true),
        COUNT(*) FILTER (WHERE es_correcta = false)
    INTO v_total_correct, v_total_incorrect
    FROM public.respuestas
    WHERE intento_id = p_intento_id;

    -- Basic scoring: 1 point per correct
    v_score := v_total_correct * 1.0;

    -- Total questions
    SELECT COUNT(*) INTO v_total_questions FROM public.session_questions WHERE intento_id = p_intento_id;

    -- Update intento
    UPDATE public.intentos
    SET 
        completed_at = NOW(),
        estado = 'submitted',
        score = v_score,
        total_correct = v_total_correct,
        total_incorrect = v_total_incorrect
    WHERE id = p_intento_id;

    RETURN jsonb_build_object(
        'score', v_score,
        'correct', v_total_correct,
        'incorrect', v_total_incorrect,
        'total', v_total_questions
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
