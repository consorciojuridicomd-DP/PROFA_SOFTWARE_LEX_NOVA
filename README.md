# PROFA SOFTWARE LEX NOVA (v1.0)
> **Simulador de Exámenes y Evaluación para Aspirantes a Jueces y Fiscales (31° PROFA)**

Sistema integral de evaluación técnica y jurídica, diseñado para simular el examen oficial del PROFA con estrictas medidas de seguridad, corrección automatizada en servidor y análisis de brechas de conocimiento.

## 🚀 Características Principales

### 🎓 Para el Alumno
- **Simulacros por Categoría:** Práctica enfocada en Derecho Penal, Civil, Constitucional, etc.
- **Examen Oficial (Simulación):**
  - **Timer Server-Truth:** El tiempo es controlado por el servidor (Edge Functions), imposible de manipular desde el cliente.
  - **Sin Feedback Inmediato:** Las respuestas correctas NO se envían al navegador durante el examen.
- **Dashboard de Rendimiento:** Gráficos de barras y análisis de progreso por materia.
- **Plan de Estudio Inteligente:** Recomendaciones basadas en las brechas detectadas en los exámenes.

### 🛡️ Para el Administrador
- **Gestión de Usuarios:** Aprobación/Rechazo de registros, desactivación de cuentas.
- **Banco de Preguntas:** CRUD completo de preguntas, categorización y niveles de dificultad.
- **Importador de PDFs (Local):** Herramienta para procesar balotarios en PDF desde rutas locales (`G:\...`), extraer texto (con OCR si aplica), y convertirlos en borradores de preguntas.
- **Auditoría:** Trazabilidad de accesos y resultados.

### ⚖️ Referencias Legales
- Módulo de consulta de normas vigentes.
- Integración con fuentes oficiales (sin scraping agresivo).

---

## 🛠️ Stack Tecnológico

Este proyecto utiliza una arquitectura moderna, tipada y escalable:

- **Frontend / Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Gráficos:** Recharts (Barras, Líneas, Donas)
- **Estado / Data Fetching:** TanStack Query + Zustand
- **Validación:** Zod + React Hook Form
- **Backend (BaaS):** [Supabase](https://supabase.com/)
  - **Auth:** Gestión de usuarios y roles (JWT).
  - **Postgres:** Base de datos relacional con RLS (Row Level Security).
  - **Storage:** Almacenamiento de PDFs y evidencias.
  - **Edge Functions:** Lógica de negocio crítica (corrección de exámenes, timer).

---

## 📋 Requisitos Previos

Para ejecutar este proyecto localmente necesitas:

1.  **Node.js:** Versión LTS (v18 o v20 recomendado).
2.  **Gestor de Paquetes:** `npm` o `pnpm`.
3.  **Git:** Para control de versiones.
4.  **Supabase CLI:** (Opcional, para desarrollo de Edge Functions).

---

## ⚙️ Configuración del Entorno (.env.local)

Crea un archivo `.env.local` en la raíz de `profa-web/` con las siguientes variables.
**NOTA:** Nunca subas este archivo al repositorio.

```bash
# Conexión Pública (Cliente)
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key-publica"

# SOLO EN SERVIDOR / EDGE FUNCTIONS (NO EN NEXT_PUBLIC)
# Esta clave tiene privilegios totales. Úsala solo en scripts o Edge Functions.
SUPABASE_SERVICE_ROLE_KEY="tu-service-role-key-secreta"
```

---

## 🚀 Setup Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/consorciojuridicomd-DP/PROFA_SOFTWARE_LEX_NOVA.git
    cd PROFA_SOFTWARE_LEX_NOVA
    ```

2.  **Instalar dependencias:**
    ```bash
    cd profa-web
    npm install
    ```

3.  **Correr servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    Visita `http://localhost:3000` en tu navegador.

4.  **Verificación de código:**
    ```bash
    npm run lint       # Análisis estático
    npm run build      # Prueba de compilación producción
    ```

---

## 🔄 Base de Datos y Migraciones

El esquema de base de datos se maneja via Supabase Migrations o Scripts SQL.
Los scripts principales se encuentran en la carpeta `/supa_scripts`:

1.  `01_main_schema.sql`: Estructura base (tablas, relaciones).
2.  `02_rls_policies.sql`: Políticas de seguridad (Row Level Security).
3.  `04_rpc_logic.sql`: Funciones almacenadas críticas.
4.  `05_admin_user_mgmt.sql`: Lógica administrativa (Security Definer).

Para aplicar cambios, usa el SQL Editor de Supabase o la CLI.

---

## 📂 Importador de PDFs (Nota Técnica)

Debido a restricciones de seguridad del navegador, la aplicación web **NO** puede leer directamente carpetas del sistema de archivos (ej. `G:\BALOTARIOS 2026`).

**Flujo de Importación:**
1.  El usuario selecciona archivos PDF manualmente via el UI de Importación.
2.  O se ejecuta un script local (Node.js) que:
    - Escanea la carpeta `G:\...`.
    - Sube los archivos a Supabase Storage.
    - Registra la metadata en la tabla `source_documents`.
    - (Opcional) Dispara un Webhook para procesar el texto.

---

## 🔒 Reglas de Seguridad Implementadas

1.  **No Filtración de Respuestas:** El cliente web NUNCA recibe el campo `is_correct` de las opciones. Solo recibe IDs y textos.
2.  **Corrección Server-Only:** El puntaje se calcula exclusivamente en una Edge Function (`submit-exam`), comparando los IDs enviados contra la base de datos segura.
3.  **Timer Autoritativo:** El inicio (`started_at`) y fin (`ends_at`) del examen se firman en la base de datos. El cliente solo visualiza el tiempo restante, pero no puede "congelarlo".
4.  **RLS (Row Level Security):**
    - `students` solo ven sus propios exámenes.
    - `admins` tienen acceso global via funciones `SECURITY DEFINER`.

---

## 📄 Licencia

© 2026 **PROFA Software Lex Nova**. Todos los derechos reservados.
Desarrollado para fines académicos y de evaluación profesional.
Prohibida su distribución no autorizada.
