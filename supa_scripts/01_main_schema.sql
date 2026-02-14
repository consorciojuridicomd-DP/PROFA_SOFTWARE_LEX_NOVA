-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMS
CREATE TYPE user_role AS ENUM ('student', 'admin', 'docente');
CREATE TYPE question_type AS ENUM ('single', 'vf', 'multi');
CREATE TYPE difficulty_level AS ENUM ('1', '2', '3', '4', '5');
CREATE TYPE question_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE exam_mode AS ENUM ('simulacro', 'materia', 'personalizado');
CREATE TYPE session_status AS ENUM ('in_progress', 'submitted', 'expired');
CREATE TYPE study_priority AS ENUM ('alta', 'media', 'repaso');
CREATE TYPE importation_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- 1. PROFILES (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role user_role DEFAULT 'student'::user_role,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATALOGS (Materias / Subtemas aka Categories / Topics)
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

-- 3. QUESTIONS ENGINE
CREATE TABLE IF NOT EXISTS public.preguntas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subtema_id UUID REFERENCES public.subtemas(id) ON DELETE SET NULL,
    materia_id UUID REFERENCES public.materias(id) ON DELETE SET NULL, -- Denormalized for simpler querying
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

-- 4. EXAMS & TEMPLATES
CREATE TABLE IF NOT EXISTS public.examenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    descripcion TEXT,
    duracion_min INT NOT NULL DEFAULT 60,
    configuracion JSONB DEFAULT '{}'::JSONB, -- For advanced config like filtering by topics
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

-- 5. EXECUTION (Sessions / Attempts)
CREATE TABLE IF NOT EXISTS public.intentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    examen_id UUID REFERENCES public.examenes(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ, -- The theoretical end time
    completed_at TIMESTAMPTZ, -- Actual submission time
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
    es_correcta BOOLEAN NOT NULL, -- Snapshot for history
    responded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(intento_id, pregunta_id) -- One answer per question per attempt
);

-- 6. PROGRESS & ANTIFRAUD
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

-- 7. IMPORT & SOURCES
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

-- TRIGGERS & FUNCTIONS

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_preguntas_updated_at BEFORE UPDATE ON public.preguntas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_plan_estudio_updated_at BEFORE UPDATE ON public.plan_estudio FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

