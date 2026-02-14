-- ==============================================================================
-- 00_SETUP_FULL.sql
-- ARCHIVO MAESTRO DE CONFIGURACIÓN BOOTSTRAP
-- Ejecuta este script en el Supabase SQL Editor para configurar TODO el backend.
-- Incluye: Tablas, RLS, Datos de prueba (Seed), Lógica RPC (Timer) y Admin.
-- ==============================================================================

-- ==============================================================================
-- 1. MAIN SCHEMA (Tablas y Tipos)
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'admin', 'docente');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE question_type AS ENUM ('single', 'vf', 'multi');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE difficulty_level AS ENUM ('1', '2', '3', '4', '5');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE question_status AS ENUM ('draft', 'active', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE exam_mode AS ENUM ('simulacro', 'materia', 'personalizado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_status AS ENUM ('in_progress', 'submitted', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE study_priority AS ENUM ('alta', 'media', 'repaso');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE importation_status AS ENUM ('pending', 'processing', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role user_role DEFAULT 'student'::user_role,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.materias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    orden INT DEFAULT 0,
    peso_opcional NUMERIC,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subtemas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    materia_id UUID REFERENCES public.materias(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    orden INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.preguntas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subtema_id UUID REFERENCES public.subtemas(id) ON DELETE SET NULL,
    materia_id UUID REFERENCES public.materias(id) ON DELETE SET NULL, 
    enunciado TEXT NOT NULL,
    tipo question_type DEFAULT 'single'::question_type,
    dificultad INT DEFAULT 3 CHECK (dificultad BETWEEN 1 AND 5),
    explicacion TEXT,
    fuente_bibliografica TEXT,
    estado question_status DEFAULT 'draft'::question_status,
    requires_ocr BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.alternativas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pregunta_id UUID REFERENCES public.preguntas(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    es_correcta BOOLEAN NOT NULL DEFAULT FALSE,
    orden INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.examenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    descripcion TEXT,
    duracion_min INT NOT NULL DEFAULT 60,
    configuracion JSONB DEFAULT '{}'::JSONB, 
    activo BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.examen_preguntas (
    examen_id UUID REFERENCES public.examenes(id) ON DELETE CASCADE,
    pregunta_id UUID REFERENCES public.preguntas(id) ON DELETE CASCADE,
    orden INT DEFAULT 0,
    PRIMARY KEY (examen_id, pregunta_id)
);

CREATE TABLE IF NOT EXISTS public.intentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    examen_id UUID REFERENCES public.examenes(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ, 
    completed_at TIMESTAMPTZ, 
    score NUMERIC DEFAULT 0,
    total_correct INT DEFAULT 0,
    total_incorrect INT DEFAULT 0,
    estado session_status DEFAULT 'in_progress'::session_status,
    tiempo_usado_seg INT DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.respuestas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intento_id UUID REFERENCES public.intentos(id) ON DELETE CASCADE,
    pregunta_id UUID REFERENCES public.preguntas(id) ON DELETE CASCADE,
    alternativa_id UUID REFERENCES public.alternativas(id) ON DELETE CASCADE,
    es_correcta BOOLEAN NOT NULL, 
    responded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(intento_id, pregunta_id) 
);

CREATE TABLE IF NOT EXISTS public.plan_estudio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    materia_id UUID REFERENCES public.materias(id) ON DELETE CASCADE,
    subtema_id UUID REFERENCES public.subtemas(id) ON DELETE CASCADE,
    prioridad study_priority DEFAULT 'media'::study_priority,
    meta_porcentaje INT DEFAULT 80,
    nivel_actual INT DEFAULT 0,
    motivo TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.eventos_antifraude (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    intento_id UUID REFERENCES public.intentos(id) ON DELETE CASCADE,
    evento TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.source_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    sha256 TEXT,
    imported_at TIMESTAMPTZ DEFAULT NOW(),
    import_status importation_status DEFAULT 'pending'::importation_status,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS public.import_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_document_id UUID REFERENCES public.source_documents(id) ON DELETE CASCADE,
    status importation_status DEFAULT 'pending'::importation_status,
    stats_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.legal_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    base_url TEXT
);

CREATE TABLE IF NOT EXISTS public.legal_refs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES public.legal_sources(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    snippet TEXT,
    tags TEXT[],
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    related_materia_id UUID REFERENCES public.materias(id) ON DELETE SET NULL,
    related_subtema_id UUID REFERENCES public.subtemas(id) ON DELETE SET NULL
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_preguntas_updated_at ON public.preguntas;
CREATE TRIGGER update_preguntas_updated_at BEFORE UPDATE ON public.preguntas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_plan_estudio_updated_at ON public.plan_estudio;
CREATE TRIGGER update_plan_estudio_updated_at BEFORE UPDATE ON public.plan_estudio FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'student')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==============================================================================
-- 2. RLS POLICIES
-- ==============================================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alternativas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examen_preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respuestas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_estudio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos_antifraude ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_refs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() = 'admin';
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_docente_or_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() IN ('admin', 'docente');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Drop logic for policies to avoid duplicates errors
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
CREATE POLICY "Users can read own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.user_profiles;
CREATE POLICY "Admins can read all profiles" ON public.user_profiles FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins full access profiles" ON public.user_profiles;
CREATE POLICY "Admins full access profiles" ON public.user_profiles FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated read active materias" ON public.materias;
CREATE POLICY "Authenticated read active materias" ON public.materias FOR SELECT TO authenticated USING (activo = true);

DROP POLICY IF EXISTS "Authenticated read active subtemas" ON public.subtemas;
CREATE POLICY "Authenticated read active subtemas" ON public.subtemas FOR SELECT TO authenticated USING (activo = true);

DROP POLICY IF EXISTS "Admin/Docente manage materias" ON public.materias;
CREATE POLICY "Admin/Docente manage materias" ON public.materias FOR ALL USING (public.is_docente_or_admin());

DROP POLICY IF EXISTS "Admin/Docente manage subtemas" ON public.subtemas;
CREATE POLICY "Admin/Docente manage subtemas" ON public.subtemas FOR ALL USING (public.is_docente_or_admin());

DROP POLICY IF EXISTS "Admin/Docente manage preguntas" ON public.preguntas;
CREATE POLICY "Admin/Docente manage preguntas" ON public.preguntas FOR ALL USING (public.is_docente_or_admin());

DROP POLICY IF EXISTS "Admin/Docente manage alternativas" ON public.alternativas;
CREATE POLICY "Admin/Docente manage alternativas" ON public.alternativas FOR ALL USING (public.is_docente_or_admin());

DROP POLICY IF EXISTS "Students read active exams" ON public.examenes;
CREATE POLICY "Students read active exams" ON public.examenes FOR SELECT TO authenticated USING (activo = true);

DROP POLICY IF EXISTS "Admin/Docente manage exams" ON public.examenes;
CREATE POLICY "Admin/Docente manage exams" ON public.examenes FOR ALL USING (public.is_docente_or_admin());

DROP POLICY IF EXISTS "Admin/Docente manage examen_preguntas" ON public.examen_preguntas;
CREATE POLICY "Admin/Docente manage examen_preguntas" ON public.examen_preguntas FOR ALL USING (public.is_docente_or_admin());

DROP POLICY IF EXISTS "Users read own attempts" ON public.intentos;
CREATE POLICY "Users read own attempts" ON public.intentos FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users read own responses" ON public.respuestas;
CREATE POLICY "Users read own responses" ON public.respuestas FOR SELECT USING (EXISTS (SELECT 1 FROM public.intentos i WHERE i.id = respuestas.intento_id AND i.user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins view all attempts" ON public.intentos;
CREATE POLICY "Admins view all attempts" ON public.intentos FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins view all responses" ON public.respuestas;
CREATE POLICY "Admins view all responses" ON public.respuestas FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Users manage own study plan" ON public.plan_estudio;
CREATE POLICY "Users manage own study plan" ON public.plan_estudio FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins view study plans" ON public.plan_estudio;
CREATE POLICY "Admins view study plans" ON public.plan_estudio FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Users insert fraud events" ON public.eventos_antifraude;
CREATE POLICY "Users insert fraud events" ON public.eventos_antifraude FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins view fraud events" ON public.eventos_antifraude;
CREATE POLICY "Admins view fraud events" ON public.eventos_antifraude FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admin manage sources" ON public.source_documents;
CREATE POLICY "Admin manage sources" ON public.source_documents FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin manage import jobs" ON public.import_jobs;
CREATE POLICY "Admin manage import jobs" ON public.import_jobs FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated read legal refs" ON public.legal_refs;
CREATE POLICY "Authenticated read legal refs" ON public.legal_refs FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin manage legal refs" ON public.legal_refs;
CREATE POLICY "Admin manage legal refs" ON public.legal_refs FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin manage legal sources" ON public.legal_sources;
CREATE POLICY "Admin manage legal sources" ON public.legal_sources FOR ALL USING (public.is_admin());


-- ==============================================================================
-- 3. SEED DATA (Datos de Prueba)
-- ==============================================================================
INSERT INTO public.materias (nombre, orden, activo) VALUES
('Argumentación y Razonamiento Jurídico', 10, true),
('Derecho Constitucional', 20, true),
('Derecho Civil', 30, true),
('Derecho Procesal Civil', 40, true),
('Derecho Penal', 50, true),
('Derecho Procesal Penal', 60, true),
('Derecho Administrativo', 70, true)
ON CONFLICT DO NOTHING;

DO $$
DECLARE
    m_const UUID;
    m_penal UUID;
    m_civil UUID;
BEGIN
    SELECT id INTO m_const FROM public.materias WHERE nombre = 'Derecho Constitucional';
    SELECT id INTO m_penal FROM public.materias WHERE nombre = 'Derecho Penal';
    SELECT id INTO m_civil FROM public.materias WHERE nombre = 'Derecho Civil';

    INSERT INTO public.subtemas (materia_id, nombre, orden) VALUES
    (m_const, 'Derechos Fundamentales', 1),
    (m_const, 'Procesos Constitucionales', 2),
    (m_penal, 'Teoría del Delito', 1),
    (m_penal, 'Parte Especial - Homicidio', 2),
    (m_civil, 'Acto Jurídico', 1),
    (m_civil, 'Contratos', 2)
    ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
    s_subtema_const UUID;
    q_id UUID;
    e_id UUID;
BEGIN
    SELECT id INTO s_subtema_const FROM public.subtemas WHERE nombre = 'Derechos Fundamentales' LIMIT 1;
    
    -- Check if exam exists
    IF NOT EXISTS (SELECT 1 FROM public.examenes WHERE titulo = 'Simulacro Demo 2026') THEN
        INSERT INTO public.examenes (titulo, descripcion, duracion_min, activo)
        VALUES ('Simulacro Demo 2026', 'Examen demostrativo con 3 preguntas.', 30, true)
        RETURNING id INTO e_id;

        -- Q1
        INSERT INTO public.preguntas (subtema_id, enunciado, tipo, dificultad, estado)
        VALUES (s_subtema_const, '¿Cuál es la característica principal de los derechos fundamentales?', 'single', 2, 'active')
        RETURNING id INTO q_id;

        INSERT INTO public.alternativas (pregunta_id, texto, es_correcta) VALUES
        (q_id, 'Son absolutos e ilimitados.', false),
        (q_id, 'Son inherentes a la persona humana.', true),
        (q_id, 'Dependen de la voluntad del Estado.', false),
        (q_id, 'Solo se aplican a ciudadanos.', false);

        INSERT INTO public.examen_preguntas (examen_id, pregunta_id, orden) VALUES (e_id, q_id, 1);

        -- Q2
        INSERT INTO public.preguntas (subtema_id, enunciado, tipo, dificultad, estado)
        VALUES (s_subtema_const, 'El derecho a la vida está protegido desde:', 'single', 1, 'active')
        RETURNING id INTO q_id;

        INSERT INTO public.alternativas (pregunta_id, texto, es_correcta) VALUES
        (q_id, 'El nacimiento.', false),
        (q_id, 'La inscripción en RENIEC.', false),
        (q_id, 'La concepción.', true),
        (q_id, 'La mayoría de edad.', false);

        INSERT INTO public.examen_preguntas (examen_id, pregunta_id, orden) VALUES (e_id, q_id, 2);

        -- Q3
        INSERT INTO public.preguntas (subtema_id, enunciado, tipo, dificultad, estado)
        VALUES (s_subtema_const, 'La acción de amparo procede contra:', 'single', 3, 'active')
        RETURNING id INTO q_id;

        INSERT INTO public.alternativas (pregunta_id, texto, es_correcta) VALUES
        (q_id, 'Hechos u omisiones que vulneran derechos constitucionales distintos a la libertad individual.', true),
        (q_id, 'Cualquier resolución judicial.', false),
        (q_id, 'Normas legales autoaplicativas únicamente.', false),
        (q_id, 'Conflictos entre particulares solamente.', false);

        INSERT INTO public.examen_preguntas (examen_id, pregunta_id, orden) VALUES (e_id, q_id, 3);
    END IF;
END $$;


-- ==============================================================================
-- 4. RPC LOGIC (Backend Logic & Timer)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.session_questions (
    intento_id UUID REFERENCES public.intentos(id) ON DELETE CASCADE,
    pregunta_id UUID REFERENCES public.preguntas(id) ON DELETE CASCADE,
    orden INT NOT NULL,
    PRIMARY KEY (intento_id, pregunta_id)
);
ALTER TABLE public.session_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own session questions" ON public.session_questions;
CREATE POLICY "Users read own session questions" ON public.session_questions
FOR SELECT USING (EXISTS (SELECT 1 FROM public.intentos i WHERE i.id = session_questions.intento_id AND i.user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.start_session(
    p_examen_id UUID,
    p_config JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID AS $$
DECLARE
    v_intento_id UUID;
    v_user_id UUID;
    v_duration INT;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
    SELECT duracion_min INTO v_duration FROM public.examenes WHERE id = p_examen_id;
    
    INSERT INTO public.intentos (examen_id, user_id, started_at, ended_at, estado, metadata)
    VALUES (p_examen_id, v_user_id, NOW(), NOW() + (v_duration || ' minutes')::INTERVAL, 'in_progress', p_config)
    RETURNING id INTO v_intento_id;

    INSERT INTO public.session_questions (intento_id, pregunta_id, orden)
    SELECT v_intento_id, pregunta_id, orden
    FROM public.examen_preguntas
    WHERE examen_id = p_examen_id;
    
    RETURN v_intento_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_session_questions(p_intento_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_result JSONB;
BEGIN
    v_user_id := auth.uid();
    PERFORM 1 FROM public.intentos WHERE id = p_intento_id AND user_id = v_user_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Session not found or access denied'; END IF;

    SELECT jsonb_agg(
        jsonb_build_object(
            'id', q.id,
            'stem', q.enunciado,
            'tipo', q.tipo,
            'dificultad', q.dificultad,
            'category', m.nombre,
            'orden', sq.orden,
            'options', (
                SELECT jsonb_agg(jsonb_build_object('id', a.id, 'text', a.texto, 'orden', a.orden) ORDER BY a.orden)
                FROM public.alternativas a WHERE a.pregunta_id = q.id
            )
        ) ORDER BY sq.orden
    ) INTO v_result
    FROM public.session_questions sq
    JOIN public.preguntas q ON sq.pregunta_id = q.id
    LEFT JOIN public.materias m ON q.materia_id = m.id
    WHERE sq.intento_id = p_intento_id;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FIXED: CHECK STATUS = 'in_progress'
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
    SELECT ended_at, estado INTO v_ended_at, v_estado 
    FROM public.intentos 
    WHERE id = p_intento_id AND user_id = v_user_id;
    
    IF NOT FOUND THEN RAISE EXCEPTION 'Session not found'; END IF;
    IF v_estado != 'in_progress' THEN RAISE EXCEPTION 'Session is closed (Status: %)', v_estado; END IF;

    IF NOW() > v_ended_at THEN 
         UPDATE public.intentos SET estado = 'expired', completed_at = NOW() WHERE id = p_intento_id;
         RAISE EXCEPTION 'Time expired'; 
    END IF;

    SELECT es_correcta INTO v_es_correcta FROM public.alternativas WHERE id = p_alternativa_id AND pregunta_id = p_pregunta_id;

    INSERT INTO public.respuestas (intento_id, pregunta_id, alternativa_id, es_correcta, responded_at)
    VALUES (p_intento_id, p_pregunta_id, p_alternativa_id, v_es_correcta, NOW())
    ON CONFLICT (intento_id, pregunta_id) 
    DO UPDATE SET alternativa_id = EXCLUDED.alternativa_id, es_correcta = EXCLUDED.es_correcta, responded_at = NOW();
        
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
    PERFORM 1 FROM public.intentos WHERE id = p_intento_id AND user_id = v_user_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Session not found'; END IF;

    SELECT COUNT(*) FILTER (WHERE es_correcta = true), COUNT(*) FILTER (WHERE es_correcta = false)
    INTO v_total_correct, v_total_incorrect
    FROM public.respuestas WHERE intento_id = p_intento_id;

    v_score := v_total_correct * 1.0;
    SELECT COUNT(*) INTO v_total_questions FROM public.session_questions WHERE intento_id = p_intento_id;

    UPDATE public.intentos
    SET completed_at = NOW(), estado = 'submitted', score = v_score, total_correct = v_total_correct, total_incorrect = v_total_incorrect
    WHERE id = p_intento_id;

    RETURN jsonb_build_object('score', v_score, 'correct', v_total_correct, 'incorrect', v_total_incorrect, 'total', v_total_questions);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 5. ADMIN USER MGMT
-- ==============================================================================
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS dni TEXT UNIQUE;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS contact_email TEXT;

CREATE OR REPLACE FUNCTION public.toggle_user_active(p_user_id UUID, p_is_active BOOLEAN)
RETURNS BOOLEAN AS $$
DECLARE v_caller_role TEXT;
BEGIN
    SELECT role INTO v_caller_role FROM public.user_profiles WHERE id = auth.uid();
    IF v_caller_role != 'admin' THEN RAISE EXCEPTION 'Only admin can toggle user status'; END IF;
    UPDATE public.user_profiles SET is_active = p_is_active, updated_at = NOW() WHERE id = p_user_id;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.admin_get_users()
RETURNS JSONB AS $$
DECLARE v_caller_role TEXT; v_result JSONB;
BEGIN
    SELECT role INTO v_caller_role FROM public.user_profiles WHERE id = auth.uid();
    IF v_caller_role != 'admin' THEN RAISE EXCEPTION 'Only admin can list users'; END IF;
    SELECT jsonb_agg(jsonb_build_object('id', up.id, 'email', au.email, 'full_name', up.full_name, 'dni', up.dni, 'contact_email', up.contact_email, 'role', up.role, 'is_active', up.is_active, 'created_at', up.created_at) ORDER BY up.created_at DESC) INTO v_result
    FROM public.user_profiles up JOIN auth.users au ON up.id = au.id;
    RETURN COALESCE(v_result, '[]'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.admin_set_role(p_user_id UUID, p_role TEXT)
RETURNS BOOLEAN AS $$
DECLARE v_caller_role TEXT;
BEGIN
    SELECT role INTO v_caller_role FROM public.user_profiles WHERE id = auth.uid();
    IF v_caller_role != 'admin' THEN RAISE EXCEPTION 'Only admin can change roles'; END IF;
    UPDATE public.user_profiles SET role = p_role::user_role, updated_at = NOW() WHERE id = p_user_id;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.admin_reject_user(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE v_caller_role TEXT;
BEGIN
    SELECT role INTO v_caller_role FROM public.user_profiles WHERE id = auth.uid();
    IF v_caller_role != 'admin' THEN RAISE EXCEPTION 'Only admin can reject users'; END IF;
    DELETE FROM public.user_profiles WHERE id = p_user_id;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
