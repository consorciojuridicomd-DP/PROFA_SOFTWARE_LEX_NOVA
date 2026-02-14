-- 0. Enable RLS on all tables
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

-- 1. Helper Functions
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

-- 2. Policies

-- user_profiles
-- Users can read their own profile.
CREATE POLICY "Users can read own profile" ON public.user_profiles
FOR SELECT USING (auth.uid() = id);

-- Admin can read all profiles.
CREATE POLICY "Admins can read all profiles" ON public.user_profiles
FOR SELECT USING (public.is_admin());

-- Users can update their own profile (limited fields ideally, but for now RLS on row).
CREATE POLICY "Users can update own profile" ON public.user_profiles
FOR UPDATE USING (auth.uid() = id);

-- Admns/Docentes full access (handled by is_admin check, usually admin role bypasses RLS in supabase dashboard if they are superuser, but for app logic:)
CREATE POLICY "Admins full access profiles" ON public.user_profiles
FOR ALL USING (public.is_admin());


-- CATALOGS (materias, subtemas)
-- Everyone authenticated can read active catalogs.
CREATE POLICY "Authenticated read active materias" ON public.materias
FOR SELECT TO authenticated USING (activo = true);

CREATE POLICY "Authenticated read active subtemas" ON public.subtemas
FOR SELECT TO authenticated USING (activo = true);

-- Admins/Docentes can CRUD everything.
CREATE POLICY "Admin/Docente manage materias" ON public.materias
FOR ALL USING (public.is_docente_or_admin());

CREATE POLICY "Admin/Docente manage subtemas" ON public.subtemas
FOR ALL USING (public.is_docente_or_admin());


-- QUESTIONS & EXAMS (preguntas, alternativas, examenes, examen_preguntas)
-- Req: Questions/Options NOT accessible directly by students.
-- So NO SELECT policy for 'student' role on preguntas/alternativas.
-- ONLY 'admin' or 'docente' can select/insert/update/delete.

CREATE POLICY "Admin/Docente manage preguntas" ON public.preguntas
FOR ALL USING (public.is_docente_or_admin());

CREATE POLICY "Admin/Docente manage alternativas" ON public.alternativas
FOR ALL USING (public.is_docente_or_admin());

-- Examenes: Students can read ACTIVE exams (titles, descriptions, config).
CREATE POLICY "Students read active exams" ON public.examenes
FOR SELECT TO authenticated USING (activo = true);

CREATE POLICY "Admin/Docente manage exams" ON public.examenes
FOR ALL USING (public.is_docente_or_admin());

-- Examen_preguntas: Admin/Docente only. 
-- Students DO NOT need to query this directly. The Edge Function 'start-session' populates 'intentos'/'respuestas' or 'session_questions'.
-- Wait, if 'start-session' creates a session, it needs to access these tables using SERVICE_ROLE.
-- Standard Users (Students) don't need direct access.
CREATE POLICY "Admin/Docente manage examen_preguntas" ON public.examen_preguntas
FOR ALL USING (public.is_docente_or_admin());


-- EXECUTION (intentos, respuestas)
-- Users can see their own attempts.
CREATE POLICY "Users read own attempts" ON public.intentos
FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own attempts (via Edge Function normally, but if we allow client creation, strict checks needed).
-- Req: "start-session" Edge Function creates it. So user doesn't need INSERT permission if function uses Service Role.
-- However, if we use client-side instantiation (not recommended by rules), we'd need INSERT.
-- Rules say: "startSession" via Edge Function.
-- So Students DO NOT need INSERT on `intentos`.
-- BUT: `respuestas`? "submitAnswer" via Edge Function.
-- So Students DO NOT need INSERT on `respuestas` either.
-- They might need READ access to review history.
CREATE POLICY "Users read own responses" ON public.respuestas
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.intentos i 
    WHERE i.id = respuestas.intento_id AND i.user_id = auth.uid()
  )
);

-- Admins can view all attempts/responses.
CREATE POLICY "Admins view all attempts" ON public.intentos
FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins view all responses" ON public.respuestas
FOR SELECT USING (public.is_admin());


-- PLAN ESTUDIO
-- Users read/own.
CREATE POLICY "Users manage own study plan" ON public.plan_estudio
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins view study plans" ON public.plan_estudio
FOR SELECT USING (public.is_admin());

-- ANTIFRAUDE
-- Users insert events (client side trigger? or server side?)
-- Likely client sends events.
CREATE POLICY "Users insert fraud events" ON public.eventos_antifraude
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view fraud events" ON public.eventos_antifraude
FOR SELECT USING (public.is_admin());


-- IMPORT & SOURCES (Admin only)
CREATE POLICY "Admin manage sources" ON public.source_documents
FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage import jobs" ON public.import_jobs
FOR ALL USING (public.is_admin());

-- LEGAL REFS
-- Public read (authenticated)
CREATE POLICY "Authenticated read legal refs" ON public.legal_refs
FOR SELECT TO authenticated USING (true);

-- Admin manage
CREATE POLICY "Admin manage legal refs" ON public.legal_refs
FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage legal sources" ON public.legal_sources
FOR ALL USING (public.is_admin());
