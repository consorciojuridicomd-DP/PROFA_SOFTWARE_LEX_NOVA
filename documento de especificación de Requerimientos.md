ACTÚA COMO: Lead Full-Stack Engineer \+ Arquitecto de Software (calidad de producción).  
OBJETIVO: Construir la APP pública “31° PROFA – Evaluación Aspirantes (Jueces/Fiscales)” con Supabase (Auth \+ Postgres \+ Storage \+ Edge Functions), dashboard con gráficos (predominantemente BARRAS), temporizador antifraude, admin completo, e importador desde PDFs locales.

\========================================================  
0\) STACK OBLIGATORIO  
\========================================================  
\- Next.js 14+ (App Router) \+ TypeScript  
\- TailwindCSS \+ shadcn/ui (componentes)  
\- Recharts (charts)  
\- TanStack Query (data fetching/cache)  
\- Zod \+ React Hook Form  
\- Supabase: Auth \+ Postgres \+ Storage \+ Edge Functions  
\- Supabase CLI para migrations/seed  
\- ESLint \+ Prettier configurados  
\- Deploy: preparado para Vercel (sin secretos en cliente)

\========================================================  
1\) REGLAS CRÍTICAS (PARA QUE SALGA BIEN Y NO SE DESORDENE)  
\========================================================  
A) ARQUITECTURA POR FEATURES (DOMINIO) OBLIGATORIA:  
\- Pantallas SOLO en src/app/\*\*  
\- Componentes \+ lógica por módulo en src/features/\*\*  
\- Reutilizables en src/shared/\*\*  
\- PROHIBIDO: “components gigantes” con lógica mezclada; PROHIBIDO: meter lógica de negocio dentro de UI.

B) SEGURIDAD / ANTICHEAT / NO FILTRAR RESPUESTAS:  
\- NUNCA enviar al cliente los campos correctos (is\_correct) ni claves.  
\- El cliente SOLO recibe enunciado \+ opciones (sin marcar correctas).  
\- La corrección y el puntaje se calculan SOLO en Edge Functions (server).  
\- Timer antifraude: el servidor fija started\_at y ends\_at; al refresh se recalcula contra ends\_at (server truth).  
\- Cuando termina el tiempo: bloquear respuestas y forzar cierre/submit.

C) CONFIGURABLE (NO ASUMIR PESOS NI FORMATO OFICIAL):  
\- Pesos por categoría y penalización deben ser toggles configurables por Admin.  
\- Tipos de examen: simulacro completo / por categoría / por tema / adaptativo (si se activa).

D) IMPORTANTE SOBRE PDFs:  
\- La app en producción NO puede leer directamente “G:\\...”.  
\- Se debe crear un IMPORTADOR LOCAL (script) que lea la ruta G:\\..., suba PDFs a Supabase Storage y cree preguntas draft en DB.  
\- Si el PDF es escaneado (imagen), marcar “requires\_ocr=true” y dejarlo en cola de revisión (no inventar texto).

\========================================================  
2\) RUTAS (Next App Router)  
\========================================================  
PUBLIC:  
\- / (Landing)  
\- /explore (categorías \+ simulacros disponibles)  
\- /policies (términos/privacidad/cookies)

AUTH:  
\- /auth/login  
\- /auth/register

STUDENT (protected):  
\- /app (Dashboard alumno)  
\- /app/select (seleccionar evaluación)  
\- /app/exam/\[sessionId\] (Test Runner)  
\- /app/results/\[sessionId\]  
\- /app/review/\[sessionId\]  
\- /app/study-plan  
\- /app/history  
\- /app/profile

ADMIN (protected role=admin):  
\- /admin (Admin dashboard)  
\- /admin/categories  
\- /admin/topics  
\- /admin/questions  
\- /admin/templates  
\- /admin/import  
\- /admin/quality  
\- /admin/legal-refs

\========================================================  
3\) ARQUITECTURA DE CARPETAS (OBLIGATORIA)  
\========================================================  
src/  
  app/  (rutas/páginas)  
  features/  
    auth/  
      components/ (LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, ProtectedRoute)  
      hooks/ (useAuth, useRole)  
      services/ (auth.service.ts)  
    exam/  
      components/ (TestRunner, QuestionPanel, OptionList, TimerBar, FlagDoubt, ExamNav)  
      hooks/ (useExamSession, useTimer)  
      services/ (exam.api.ts)  // llama Edge Functions  
      types/  
    results/  
      components/ (ResultSummary, ResultTable, ReviewPanel)  
      services/  
    dashboard/  
      components/ (CategoryBarChart, DonutChart, ScoreTrendLine, GapsTable)  
      services/  
    studyPlan/  
      components/ (PlanList, PracticeGapsButton)  
      logic/ (studyPlan.logic.ts)  
    admin/  
      components/ (AdminTable, QuestionEditor, TemplateBuilder, ImportWizard, QualityReports, LegalRefsPanel)  
      services/  
  shared/  
    ui/ (CyberCard, NeonButton, Modal, Toast, DataTable, FormControls)  
    lib/ (supabaseClient.ts, env.ts, validators.ts, formatters.ts, security.ts)  
    types/  
    constants/

\========================================================  
4\) DISEÑO UI/UX (FUTURISTA CIBERNÉTICO, AMIGABLE)  
\========================================================  
\- Dark \+ glassmorphism (tarjetas translúcidas), bordes suaves, sombras sutiles.  
\- Acentos neon (cian/verde/azul) sin saturar.  
\- CTA grandes, mobile-first, accesibilidad (contraste, teclado, tamaño de fuente).  
\- Examen sin distracciones: Timer visible, botones grandes (Siguiente/Responder), marcar dudosa.

\========================================================  
5\) MODELO DE DATOS (SUPABASE POSTGRES) \+ AUDITORÍA  
\========================================================  
Tablas mínimas y recomendadas:

\- user\_profiles:  
  id uuid PK references auth.users(id)  
  full\_name text  
  role text check (role in ('student','admin')) default 'student'  
  created\_at timestamptz default now()

\- categories:  
  id uuid PK  
  name text not null  
  sort\_order int default 0  
  weight\_optional numeric null  
  is\_active boolean default true

\- topics:  
  id uuid PK  
  category\_id uuid FK categories(id)  
  name text not null  
  sort\_order int default 0  
  is\_active boolean default true

\- questions:  
  id uuid PK  
  topic\_id uuid FK topics(id)  
  stem text not null  
  qtype text check (qtype in ('single','vf','multi')) default 'single'  
  difficulty int check (difficulty between 1 and 5\) default 3  
  explanation text null  
  source\_url text null  
  status text check (status in ('draft','active')) default 'draft'  
  requires\_ocr boolean default false  
  created\_by uuid null  
  created\_at timestamptz default now()  
  updated\_at timestamptz default now()

\- options:  
  id uuid PK  
  question\_id uuid FK questions(id)  
  text text not null  
  is\_correct boolean not null default false   // NUNCA exponer al cliente  
  sort\_order int default 0

\- exam\_templates:  
  id uuid PK  
  name text not null  
  config\_json jsonb not null  // categorías, cantidades, timer\_mode, timer\_value, penalizaciones, pesos, aleatoriedad  
  is\_active boolean default true  
  created\_by uuid null  
  created\_at timestamptz default now()

\- exam\_sessions:  
  id uuid PK  
  user\_id uuid FK auth.users(id)  
  template\_id uuid FK exam\_templates(id)  
  mode text not null  
  started\_at timestamptz not null  
  ends\_at timestamptz not null  
  status text check (status in ('in\_progress','submitted','expired')) default 'in\_progress'  
  score numeric default 0  
  total\_questions int default 0  
  correct\_count int default 0  
  incorrect\_count int default 0  
  time\_used\_seconds int default 0  
  created\_at timestamptz default now()

\- session\_questions (OBLIGATORIA para fijar orden y set):  
  session\_id uuid FK exam\_sessions(id)  
  question\_id uuid FK questions(id)  
  position int not null  
  primary key(session\_id, question\_id)

\- exam\_responses:  
  id uuid PK  
  session\_id uuid FK exam\_sessions(id)  
  question\_id uuid FK questions(id)  
  selected\_option\_ids uuid\[\] not null default '{}'  
  is\_correct boolean not null  
  time\_spent\_seconds int default 0  
  flagged\_doubt boolean default false  
  answered\_at timestamptz default now()

\- question\_reports (control de calidad):  
  id uuid PK  
  question\_id uuid FK questions(id)  
  user\_id uuid FK auth.users(id)  
  reason text  
  created\_at timestamptz default now()

\- audit\_log:  
  id uuid PK  
  actor\_user\_id uuid  
  entity text  
  entity\_id uuid  
  action text  
  before\_json jsonb  
  after\_json jsonb  
  created\_at timestamptz default now()

\- source\_documents:  
  id uuid PK  
  filename text  
  storage\_path text  
  sha256 text  
  imported\_at timestamptz  
  import\_status text  
  notes text

\- import\_jobs:  
  id uuid PK  
  source\_document\_id uuid FK source\_documents(id)  
  status text  
  stats\_json jsonb  
  created\_at timestamptz default now()

\- legal\_sources:  
  id uuid PK  
  name text  
  base\_url text

\- legal\_refs:  
  id uuid PK  
  source\_id uuid FK legal\_sources(id)  
  title text  
  url text  
  snippet text  
  tags text\[\]  
  fetched\_at timestamptz default now()  
  related\_category\_id uuid null  
  related\_topic\_id uuid null

\========================================================  
6\) RLS POLICIES (OBLIGATORIAS) \+ ROLES  
\========================================================  
\- user\_profiles: user puede leer su perfil; admin puede leer todo.  
\- exam\_sessions/exam\_responses/session\_questions: solo dueño (user\_id).  
\- admin (role=admin) puede CRUD categories/topics/questions/options/templates/audit/import/legal.  
\- questions/options: NO accesibles directamente por estudiantes para evitar fuga de correctas:  
  \* acceso a preguntas para examen SOLO vía Edge Functions (service role).  
  \* para “explore”: mostrar SOLO conteos/categorías/plantillas, no contenido de preguntas.

Implementar helper “is\_admin()” basado en user\_profiles.role.

\========================================================  
7\) EDGE FUNCTIONS (ENDPOINTS) — SERVER TRUTH  
\========================================================  
Implementar en Supabase Edge Functions (TypeScript) con service role:

1\) POST /functions/v1/start-session  
   input: templateId, mode, settings\_override (opcional)  
   server:  
   \- valida auth  
   \- crea exam\_session con started\_at=now() y ends\_at=now()+duración  
   \- selecciona preguntas según config\_json (por categoría/tema/dificultad)  
   \- inserta session\_questions con orden fijo  
   output: sessionId, endsAt

2\) GET /functions/v1/session-questions?sessionId=  
   \- valida auth \+ ownership  
   \- retorna lista de preguntas y opciones SIN is\_correct

3\) POST /functions/v1/submit-answer  
   input: sessionId, questionId, selectedOptionIds, timeSpentSeconds, flaggedDoubt  
   server:  
   \- valida now() \<= ends\_at  
   \- valida que questionId está en session\_questions  
   \- calcula is\_correct comparando con options.is\_correct en DB  
   \- guarda exam\_response (upsert por question)  
   output: isCorrect (solo para feedback), remainingTime

4\) POST /functions/v1/finish-session  
   server:  
   \- marca submitted/expired  
   \- calcula score:  
     default: \+1 correcta, 0 incorrecta  
     opcional: penalización \-0.25 (si template lo activa)  
     opcional: ponderación por categoría (si template lo activa)  
   \- devuelve resumen \+ métricas

5\) GET /functions/v1/dashboard-student  
   \- barras % acierto por categoría  
   \- donut distribución respondidas por categoría  
   \- línea evolución puntaje  
   \- tabla brechas (prioridad)

6\) GET /functions/v1/dashboard-admin (solo admin)  
   \- promedio por categoría, preguntas con peor desempeño, tasa de “dudosa”, etc.

7\) POST /functions/v1/import-draft (solo admin/service)  
   \- recibe JSON de preguntas parseadas desde PDFs y las inserta como draft  
   \- genera import\_jobs stats

8\) (opcional) POST /functions/v1/refresh-legal-refs  
   \- usa proveedor de búsqueda por API KEY (configurable) sin hardcode  
   \- guarda legal\_refs  
   NOTA: respetar ToS; no scraping agresivo

\========================================================  
8\) IMPORTADOR LOCAL (OBLIGATORIO) — LEE G:\\...  
\========================================================  
Crear script local (Node.js recomendado) que:  
\- Reciba por argumento la ruta:  
  "G:\\BALOTARIO 2026\\BALOTARIOS 2025\_2026"  
\- Recorra y detecte PDFs dentro de:  
  \- 2025 BALOTARIO JNJ  
  \- 2025\_balotario\_desarrollado\_examen\_profa\_y\_acceso\_a\_la\_magistratura  
  \- balotario desarrollado 2026  
\- Extraiga texto con pdf-parse o pdfjs-dist.  
\- Si el PDF no tiene texto (escaneado), marcar requires\_ocr=true y registrar para revisión.  
\- Suba PDF a Supabase Storage (bucket: source-pdfs).  
\- Cree source\_documents \+ import\_jobs.  
\- Intente parsear preguntas:  
  \* detectar numeración (1., 1), etc)  
  \* detectar alternativas A) B) C) D) (y VF)  
  \* detectar “clave/respuesta” si existe (sin inventar)  
  \* crear JSON draft listo para /import-draft  
\- Enviar drafts al endpoint /import-draft.  
\- Escribir logs claros por archivo y resumen final.

\========================================================  
9\) DASHBOARDS (PREFERENCIA BARRAS)  
\========================================================  
Alumno:  
\- Barras: % acierto por categoría  
\- Donut: distribución respondidas por categoría  
\- Línea: evolución puntaje (intentos)  
\- Tabla brechas: categoría/tema, % acierto, tiempo medio, prioridad

Admin:  
\- Barras: promedio por categoría  
\- Lista: preguntas con peor desempeño  
\- (opcional) heatmap simple dificultad vs acierto

\========================================================  
10\) PLAN DE ESTUDIO (CORE)  
\========================================================  
Algoritmo:  
\- brecha \= (1 \- accuracy) \* (weight\_optional || 1\) \* recency\_factor  
\- recency\_factor: ponderar errores últimos 7 días \> 30 días  
Output mínimo:  
\- Top 3 temas débiles  
\- Sugerencia semanal: “3 sesiones Penal”, “2 Procesal Penal”, etc.  
Botón: “Practicar brechas” \=\> crea quiz dirigido (plantilla temporal)

\========================================================  
11\) CATEGORÍAS INICIALES (SEED, CONFIGURABLES)  
\========================================================  
\- Argumentación y razonamiento jurídico  
\- Constitucional  
\- Civil  
\- Procesal Civil  
\- Penal  
\- Procesal Penal  
\- Administrativo

\========================================================  
12\) ENTREGABLES OBLIGATORIOS DEL BUILDER  
\========================================================  
A) File tree completo del proyecto  
B) Código COMPLETO por archivo (sin omitir)  
C) SQL migrations \+ seeds \+ RLS policies (Supabase)  
D) Edge Functions completas (TS) \+ instrucciones de deploy  
E) Importador local \+ README de uso apuntando a G:\\...  
F) README paso a paso:  
   \- Supabase project \+ env vars  
   \- supabase db push / migrations  
   \- correr app local  
   \- crear admin  
   \- correr importador  
   \- pruebas de timer y seguridad

\========================================================  
13\) CRITERIOS DE ACEPTACIÓN (MÍNIMOS)  
\========================================================  
1\) Alumno: registro/login, inicia quiz con timer, responde, ve resultados y revisión.  
2\) Dashboard alumno con gráficos por categoría (barras) y evolución.  
3\) Plan de estudio: Top 3 brechas \+ botón practicar brechas.  
4\) Admin: CRUD preguntas/categorías/plantillas \+ importador PDF \+ auditoría básica.  
5\) Seguridad: ninguna API del cliente expone respuestas correctas ni is\_correct.

AHORA GENERA TODO EL PROYECTO CON CALIDAD DE PRODUCCIÓN Y COMPILABLE.  
FIN.

