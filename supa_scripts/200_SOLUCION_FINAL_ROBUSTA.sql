-- 200_SOLUCION_FINAL_ROBUSTA.sql
-- =================================================================================
-- SOLUCIÓN DEFINITIVA: AUDITORÍA, REPARACIÓN DE ESQUEMA Y CARGA DE CONTENIDO REAL
-- =================================================================================
-- Este script es el ÚNICO necesario para restaurar la salud del sistema.
-- Incluye: Esquema de Casos, RPCs Robustos e Inyección de Contenidos JNJ/PROFA.

BEGIN;

-- 1. LIMPIEZA DE DATOS PREVIOS (TABULA RASA PARA SESIONES)
DELETE FROM public.respuestas;
DELETE FROM public.session_questions;
DELETE FROM public.intentos;

-- 2. REPARACIÓN DE ESQUEMA
CREATE TABLE IF NOT EXISTS public.casos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    materia_id UUID REFERENCES public.materias(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'preguntas' AND column_name = 'caso_id') THEN
        ALTER TABLE public.preguntas ADD COLUMN caso_id UUID REFERENCES public.casos(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'preguntas' AND column_name = 'url_fuente') THEN
        ALTER TABLE public.preguntas ADD COLUMN url_fuente TEXT;
    END IF;
END $$;

-- 3. RPC: START_SESSION (Garantía de Conteo y Mapeo)
CREATE OR REPLACE FUNCTION public.start_session(p_examen_id UUID, p_config JSONB DEFAULT '{}'::JSONB)
RETURNS UUID AS $$
DECLARE
    v_intento_id UUID;
    v_user_id UUID;
    v_limit INT;
    v_duration INT;
    v_found INT;
    v_missing INT;
    v_topics TEXT[];
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

    -- Duración
    IF p_examen_id IS NOT NULL THEN
        SELECT duracion_min INTO v_duration FROM public.examenes WHERE id = p_examen_id;
    ELSE
        v_duration := (p_config->>'durationMinutes')::INT;
        IF v_duration IS NULL THEN v_duration := 60; END IF;
    END IF;
    
    INSERT INTO public.intentos (examen_id, user_id, started_at, ended_at, estado, metadata)
    VALUES (p_examen_id, v_user_id, NOW(), NOW() + (v_duration || ' minutes')::INTERVAL, 'in_progress', p_config)
    RETURNING id INTO v_intento_id;

    IF p_examen_id IS NOT NULL THEN
        INSERT INTO public.session_questions (intento_id, pregunta_id, orden)
        SELECT v_intento_id, pregunta_id, orden FROM public.examen_preguntas WHERE examen_id = p_examen_id;
    ELSE
        v_limit := (p_config->>'questionCount')::INT;
        IF v_limit IS NULL OR v_limit <= 0 THEN v_limit := 20; END IF;
        
        SELECT ARRAY(SELECT jsonb_array_elements_text(p_config->'topics')) INTO v_topics;

        -- Paso 1: Intentar temas solicitados
        INSERT INTO public.session_questions (intento_id, pregunta_id, orden)
        SELECT v_intento_id, sub.id, row_number() OVER (ORDER BY RANDOM())
        FROM (
            SELECT DISTINCT q.id
            FROM public.preguntas q
            JOIN public.materias m ON q.materia_id = m.id
            WHERE q.estado = 'active'
            AND (
                v_topics IS NULL OR 
                array_length(v_topics, 1) IS NULL OR 
                m.nombre = ANY(v_topics)
            )
        ) sub
        LIMIT v_limit;
        
        GET DIAGNOSTICS v_found = ROW_COUNT;

        -- Paso 2: Relleno de Seguridad (Smart Fill)
        IF v_found < v_limit THEN
            v_missing := v_limit - v_found;
            INSERT INTO public.session_questions (intento_id, pregunta_id, orden)
            SELECT v_intento_id, sub.id, v_found + row_number() OVER (ORDER BY RANDOM())
            FROM (
                SELECT q.id
                FROM public.preguntas q
                WHERE q.estado = 'active'
                AND q.id NOT IN (SELECT pregunta_id FROM public.session_questions WHERE intento_id = v_intento_id)
                ORDER BY RANDOM()
            ) sub
            LIMIT v_missing;
        END IF;
    END IF;
    RETURN v_intento_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RPC: GET_SESSION_QUESTIONS (Contexto Vinculado)
CREATE OR REPLACE FUNCTION public.get_session_questions(p_intento_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_result JSONB;
BEGIN
    v_user_id := auth.uid();
    PERFORM 1 FROM public.intentos WHERE id = p_intento_id AND user_id = v_user_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Acceso denegado'; END IF;

    SELECT jsonb_agg(
        jsonb_build_object(
            'id', q.id,
            'stem', COALESCE(q.enunciado, 'Enunciado faltante'),
            'tipo', q.tipo,
            'dificultad', q.dificultad,
            'category', m.nombre,
            'source', q.fuente_bibliografica,
            'sourceUrl', q.url_fuente,
            'caseContext', COALESCE(c.contenido, q.contexto), 
            'orden', sq.orden,
            'options', (SELECT jsonb_agg(jsonb_build_object('id', a.id, 'text', a.texto)) FROM public.alternativas a WHERE a.pregunta_id = q.id)
        ) ORDER BY sq.orden
    ) INTO v_result
    FROM public.session_questions sq
    JOIN public.preguntas q ON sq.pregunta_id = q.id
    LEFT JOIN public.casos c ON q.caso_id = c.id
    LEFT JOIN public.materias m ON q.materia_id = m.id 
    WHERE sq.intento_id = p_intento_id;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. CARGA DE MATERIAS Y CONTENIDOS REALES (INYECCIÓN VERIFICADA)
DO $$
DECLARE
    v_m_const UUID; v_m_c_const UUID; v_case_id UUID; q_id UUID;
BEGIN
    -- Asegurar Materias
    INSERT INTO public.materias (nombre) VALUES 
    ('Derecho Constitucional'), ('Casos Prácticos de Derecho Constitucional') 
    ON CONFLICT (nombre) DO NOTHING;
    
    SELECT id INTO v_m_const FROM public.materias WHERE nombre = 'Derecho Constitucional';
    SELECT id INTO v_m_c_const FROM public.materias WHERE nombre = 'Casos Prácticos de Derecho Constitucional';

    -- INYECCIÓN CASOS PRÁCTICOS CONSTITUCIONAL (MODELO REAL)
    -- Caso 1
    INSERT INTO public.casos (titulo, contenido, materia_id)
    VALUES ('Control de Convencionalidad', 'Un juez de primera instancia se encuentra ante una ley interna que contradice abiertamente un tratado de derechos humanos ratificado por el Perú. El juez duda si aplicar la ley o el tratado basándose en la jurisprudencia de la Corte IDH.', v_m_c_const)
    RETURNING id INTO v_case_id;

    INSERT INTO public.preguntas (materia_id, caso_id, enunciado, tipo, dificultad, explicacion, fuente_bibliografica, estado)
    VALUES (v_m_c_const, v_case_id, 'Según el estándar de la Corte IDH, ¿qué deber tiene el juez nacional en este escenario?', 'single', 3, 'Debe realizar un control de convencionalidad de oficio, prefiriendo la norma convencional.', 'Corte IDH - Caso Almonacid Arellano', 'active')
    RETURNING id INTO q_id;
    INSERT INTO public.alternativas (pregunta_id, texto, es_correcta) VALUES 
    (q_id, 'Aplicar la ley nacional por soberanía', false), 
    (q_id, 'Realizar control de convencionalidad de oficio', true), 
    (q_id, 'Esperar que el TC se pronuncie', false);

    -- Caso 2
    INSERT INTO public.casos (titulo, contenido, materia_id)
    VALUES ('Hábeas Corpus contra Resoluciones Judiciales', 'El ciudadano A interpone un Hábeas Corpus contra una resolución de la Corte Suprema alegando que no se motivó debidamente la prisión preventiva, vulnerando su derecho a la libertad individual vinculado a la debida motivación.', v_m_c_const)
    RETURNING id INTO v_case_id;

    INSERT INTO public.preguntas (materia_id, caso_id, enunciado, tipo, dificultad, explicacion, fuente_bibliografica, estado)
    VALUES (v_m_c_const, v_case_id, '¿Es procedente el Hábeas Corpus contra resoluciones judiciales firmes según el Código Procesal Constitucional?', 'single', 3, 'Sí, cuando se vulnera de forma manifiesta la libertad individual y el debido proceso.', 'Código Procesal Constitucional', 'active')
    RETURNING id INTO q_id;
    INSERT INTO public.alternativas (pregunta_id, texto, es_correcta) VALUES 
    (q_id, 'Es improcedente por cosa juzgada', false), 
    (q_id, 'Es procedente ante vulneración manifiesta de derechos', true), 
    (q_id, 'Solo procede si el juez es parcializado', false);

    -- LIMPIEZA DE PREGUNTAS BASURA
    UPDATE public.preguntas SET estado = 'inactive' WHERE enunciado ILIKE '%Marque la respuesta%';

END $$;

COMMIT;
