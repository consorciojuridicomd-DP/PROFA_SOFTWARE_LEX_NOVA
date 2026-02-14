# 🏛️ PROFA SOFTWARE LEX NOVA

**Sistema de Evaluación para Aspirantes a Jueces y Fiscales — 31° PROFA**

Plataforma web completa para **practicar, simular y diagnosticar** evaluaciones del 31° Programa de Formación de Aspirantes (PROFA) del CNM/JNJ. Incluye panel de alumno con exámenes cronometrados y dashboard de diagnóstico, y panel de administración con CRUD, importador de PDFs y gestión de usuarios.

---

## 📋 Características Principales

### 👨‍🎓 Alumno
- **Examen cronometrado** con timer antifraude (server-truth)
- **Selección por categoría y tema** del balotario PROFA
- **Dashboard de diagnóstico** con gráficos de rendimiento (barras, donut, tendencias)
- **Plan de estudio accionable** basado en brechas identificadas
- **Revisión de respuestas** post-examen

### 🔐 Administrador
- **CRUD completo** de preguntas, categorías, plantillas
- **Gestión de usuarios** (activar/rechazar solicitudes de acceso)
- **Importador local de PDFs** para cargar el balotario desde archivos locales
- **Auditoría y control de calidad** de preguntas importadas
- **Referencias legales vigentes** vinculadas a preguntas

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 16** (App Router) | Framework principal, SSR/CSR |
| **React 19** | UI Components |
| **TypeScript** | Tipado estricto |
| **Supabase** | Auth, Base de Datos (PostgreSQL), Edge Functions, Storage |
| **Tailwind CSS 4** | Sistema de estilos |
| **shadcn/ui** | Componentes UI base |
| **Recharts** | Gráficos y visualizaciones |
| **TanStack Query** | Gestión de estado del servidor |
| **Zod** | Validación de esquemas |
| **React Hook Form** | Formularios |
| **Lucide React** | Iconografía |
| **pdfjs-dist** | Extracción de texto de PDFs |

---

## 📁 Estructura del Proyecto

```
APPEXAMENPROFA2026/
├── profa-web/                  # Aplicación Next.js
│   ├── src/
│   │   ├── app/                # Rutas (App Router)
│   │   │   ├── (admin)/        # Panel administrador
│   │   │   ├── (auth)/         # Login / Registro
│   │   │   ├── (student)/      # Panel alumno
│   │   │   └── api/            # API Routes (server-side)
│   │   ├── features/           # Módulos por dominio
│   │   │   ├── admin/          # Gestión administrativa
│   │   │   ├── auth/           # Autenticación (DNI + password)
│   │   │   ├── dashboard/      # Dashboards y métricas
│   │   │   ├── exam/           # Motor de exámenes
│   │   │   ├── pdf/            # Importador de PDFs
│   │   │   └── study-plan/     # Plan de estudio
│   │   └── shared/             # UI reutilizable, tipos, utilidades
│   ├── public/                 # Assets estáticos
│   └── .env.local              # Variables de entorno (NO commitear)
├── supa_scripts/               # Scripts SQL de Supabase
│   ├── 01_main_schema.sql      # Esquema principal
│   ├── 02_rls_policies.sql     # Políticas de seguridad (RLS)
│   ├── 03_seed_data.sql        # Datos iniciales
│   ├── 04_rpc_logic.sql        # Funciones RPC del examen
│   ├── 05_admin_user_mgmt.sql  # RPCs de gestión de usuarios
│   └── 06_settings_schema.sql  # Esquema de configuración
└── README.md
```

---

## ⚡ Requisitos Previos

- **Node.js** ≥ 18.x
- **npm** (incluido con Node.js)
- **Cuenta de Supabase** con proyecto configurado
- **Git** para control de versiones

---

## 🔑 Variables de Entorno

Crear archivo `profa-web/.env.local`:

```env
# URL pública del proyecto Supabase
NEXT_PUBLIC_SUPABASE_URL=

# Clave anon (pública) — se puede exponer al cliente
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Clave service_role (SECRETA) — SOLO servidor, NUNCA en el cliente
SUPABASE_SERVICE_ROLE_KEY=
```

> ⚠️ **NUNCA** commitear valores reales de las variables de entorno. El archivo `.env.local` está excluido por `.gitignore`.

---

## 🚀 Setup Local

```bash
# 1. Clonar el repositorio
git clone <REPO_URL>
cd APPEXAMENPROFA2026/profa-web

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus valores de Supabase

# 4. Ejecutar en modo desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:3000
```

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (hot reload) |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Análisis de código (ESLint) |

---

## 🗄️ Base de Datos (Supabase)

### Migraciones

Los scripts SQL se encuentran en `supa_scripts/` y deben ejecutarse en orden en el **Supabase SQL Editor**:

1. `01_main_schema.sql` — Tablas, enums, triggers
2. `02_rls_policies.sql` — Políticas de Row Level Security
3. `03_seed_data.sql` — Datos iniciales (materias, categorías)
4. `04_rpc_logic.sql` — Funciones RPC para el motor de exámenes
5. `05_admin_user_mgmt.sql` — RPCs de gestión de usuarios (SECURITY DEFINER)
6. `06_settings_schema.sql` — Configuración global

### Funciones RPC Principales

| Función | Tipo | Descripción |
|---|---|---|
| `toggle_user_active` | SECURITY DEFINER | Activar/desactivar usuario |
| `admin_reject_user` | SECURITY DEFINER | Eliminar solicitud de usuario |
| `admin_get_users` | SECURITY DEFINER | Listar todos los usuarios |

---

## 📄 Importador Local de PDFs

> ⚠️ La web **NO puede leer** rutas locales como `G:\BALOTARIO 2026\`. El importador es un **proceso local**.

### Flujo:
1. El importador local recorre el directorio de PDFs
2. Sube los archivos a Supabase Storage (bucket `source-pdfs`)
3. Extrae texto (si es posible; marca `requires_ocr=true` si es escaneado)
4. Genera preguntas en estado `draft` (no inventa respuestas)
5. El admin revisa y activa preguntas desde el panel (`draft → active`)

---

## 🔒 Reglas de Seguridad

| Regla | Descripción |
|---|---|
| **No filtración de correctas** | `options.is_correct` NUNCA viaja al cliente |
| **Corrección server-only** | El puntaje se calcula exclusivamente en Edge Functions |
| **Timer antifraude** | El servidor fija `started_at` y `ends_at`; el cliente recalcula desde el servidor |
| **RLS + Roles** | Row Level Security activado; roles `admin`, `student`, `docente` |
| **Service Role Key** | Solo en servidor (Edge Functions / API Routes); nunca en código cliente |

---

## 🏗️ Arquitectura

```
Arquitectura por Features (SoC estricto):

UI (tonta)          → Renderiza estado, dispara eventos
Lógica (ciega)      → Reglas de negocio (scoring, timer, brechas)
Datos/Servicios     → Acceso a Supabase / Edge Functions
```

- **Frontend**: Next.js App Router con layouts por rol
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions + Storage)
- **Autenticación**: DNI como identificador, convertido internamente a `{DNI}@lexnova.app`
- **Autorización**: RLS policies + funciones `is_admin()` SECURITY DEFINER

---

## 📃 Licencia

Todos los derechos reservados © 2026 — PROFA Software Lex Nova.

Uso exclusivo para el **31° Programa de Formación de Aspirantes (PROFA)**.
