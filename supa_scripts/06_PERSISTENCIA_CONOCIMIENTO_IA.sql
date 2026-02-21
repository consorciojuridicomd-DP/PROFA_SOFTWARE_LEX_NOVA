-- 06_PERSISTENCIA_CONOCIMIENTO_IA.sql
-- Este script crea la infraestructura para que el conocimiento extraído de internet sea persistente.

-- 1. Tabla de Conocimiento IA
-- Almacenamos preguntas generadas desde internet para que no se pierdan.
CREATE TABLE IF NOT EXISTS public.preguntas_ia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    materia_id UUID REFERENCES public.materias(id),
    stem TEXT NOT NULL,
    options JSONB NOT NULL, -- [{id, text}]
    correct_option_id TEXT NOT NULL,
    difficulty_level INT DEFAULT 2,
    source TEXT DEFAULT 'Internet / IA Verídica',
    source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::JSONB -- Para guardar decretos, leyes citadas, etc.
);

-- 2. Índices para búsqueda rápida por materia
CREATE INDEX IF NOT EXISTS idx_preguntas_ia_materia ON public.preguntas_ia(materia_id);

-- 3. Habilitar RLS para que los alumnos puedan leerlas
ALTER TABLE public.preguntas_ia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Preguntas IA visibles para todos los autenticados"
ON public.preguntas_ia FOR SELECT
USING (auth.role() = 'authenticated');

-- 4. Comentarios para el sistema
COMMENT ON TABLE public.preguntas_ia IS 'Repositorio de conocimiento dinámico extraído de fuentes legales externas.';
