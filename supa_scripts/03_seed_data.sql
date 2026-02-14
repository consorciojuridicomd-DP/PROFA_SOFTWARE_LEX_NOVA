-- 03_seed_data.sql

-- 1. Insert Materias
INSERT INTO public.materias (nombre, orden, activo) VALUES
('Argumentación y Razonamiento Jurídico', 10, true),
('Derecho Constitucional', 20, true),
('Derecho Civil', 30, true),
('Derecho Procesal Civil', 40, true),
('Derecho Penal', 50, true),
('Derecho Procesal Penal', 60, true),
('Derecho Administrativo', 70, true)
ON CONFLICT DO NOTHING;

-- 2. Insert Subtemas (Examples)
-- Need to look up IDs, so using DO block or CTEs.
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

-- 3. Insert Exam & Questions
DO $$
DECLARE
    s_subtema_const UUID;
    q_id UUID;
    e_id UUID;
BEGIN
    -- Get a subtema
    SELECT id INTO s_subtema_const FROM public.subtemas WHERE nombre = 'Derechos Fundamentales' LIMIT 1;

    -- Create an Exam
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

END $$;
