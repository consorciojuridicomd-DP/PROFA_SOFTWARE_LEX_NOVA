---
trigger: always_on
---

# Reglas de Buena Práctica (Always On)
## Proyecto: APP 31° PROFA – Evaluación Aspirantes (Jueces/Fiscales) + Dashboard (Next.js + Supabase)

> **PRIME DIRECTIVE:** Actúa como **Arquitecto de Sistemas Principal**.  
> Maximiza la **velocidad de desarrollo (Vibe)** sin sacrificar la **integridad estructural (Solidez)**.  
> Estás en entorno multi-agente: cada entrega debe ser **atómica**, **explicable**, **compilable** y **no destructiva**.

---

## 0) North Star (Objetivo y Propósito — NO negociable)
El sistema existe para:
1) Permitir **practicar y simular** evaluaciones por **categoría/tema** del **31° PROFA**.
2) Dar un **examen confiable**: **timer antifraude (server truth)** y **corrección server-only**.
3) Dar **diagnóstico accionable** al alumno: dashboard con **barras** + brechas + plan de estudio.
4) Dar control al admin: **CRUD**, **plantillas**, **importador de PDFs**, **calidad** y **auditoría**.
5) Integrar “fuentes vigentes” como **referencias** (legal refs) con fecha, sin scraping agresivo.

Ningún cambio puede comprometer:
- **No filtración de correctas**
- **Timer server-truth**
- **RLS + roles**
- **Arquitectura por features**
- **Importador local para PDFs (G:\...)**

---

## I. Integridad Estructural (The Backbone)

### 1) Separación Estricta de Responsabilidades (SoC)
**Prohibido** mezclar UI + lógica + datos en el mismo archivo.

- **UI “tonta”**: renderiza estado y dispara eventos.
- **Lógica “ciega”**: reglas de negocio (scoring, brechas, selección, timer), sin UI.
- **Datos/Servicios**: acceso a Supabase/Edge Functions, sin lógica de UI.

### 2) Arquitectura por Features (obligatoria)
- `src/app/**` → **rutas/pantallas** (App Router) con mínima lógica.
- `src/features/**` → módulos por dominio:
  - `auth`, `exam`, `results`, `dashboard`, `studyPlan`, `admin`, `import`, `legalRefs`
- `src/shared/**` → UI reutilizable + utilidades + tipos + tokens

**Prohibido**: carpetas “genéricas” que acumulen todo (`components/mega`, `utils_random`).

### 3) Fronteras de Seguridad (No leaks)
**Regla innegociable:** el cliente **NO** puede obtener respuestas correctas.

- `options.is_correct` **nunca** viaja al cliente.
- Corrección y puntaje: **solo** en **Edge Functions**.
- Service role keys: **solo server** (Edge Functions / scripts locales).
- Si una pantalla necesita preguntas: se obtienen via Edge Function que retorna DTO **sin correctas**.

### 4) Timer antifraude (Server Truth)
- El servidor fija `started_at` y `ends_at`.
- En cada envío de respuesta: validar `now() <= ends_at`.
- En refresh: el cliente recalcula desde `ends_at` (no decide tiempo real).
- Al terminar tiempo: bloquear respuestas y cerrar sesión (`expired`) + auto-finish server.

### 5) Agnosticismo de Dependencias (Wrappers/Adapters)
Toda dependencia externa se encapsula en un wrapper:
- `ExamApi` (Edge Functions): `startSession`, `getSessionQuestions`, `submitAnswer`, `finishSession`
- `AdminApi` (CRUD controlado)
- `SearchProvider` (refs vigentes) usando API de búsqueda configurable
- `supabaseClient` único y tipado

### 6) Inmutabilidad por defecto
- Evitar mutaciones ocultas.
- Preferir transformar datos con copias (reduce side-effects entre agentes).

---

## II. Protocolo de Conservación de Contexto (Multi-Agent Memory)

### 1) Regla de Chesterton’s Fence
Antes de borrar/refactorizar código generado previamente:
- Explica **por qué existe** y qué protege.
- Si no se entiende, **no se borra**: se aísla y se documenta.

### 2) Código auto-documentado
- Nombres descriptivos: `getSessionQuestions` > `getData`.
- Comentarios solo para: decisiones complejas, tradeoffs, o “hack” temporal (con justificación).

### 3) Atomicidad (siempre compila)
Cada entrega debe:
- Compilar (`build`), pasar `typecheck` y `lint`.
- Incluir migraciones si cambia DB.
- Actualizar types/DTOs si cambia un endpoint.
- No dejar “TODO crítico”.

### 4) Contract-First
- DTOs y tipos compartidos en `src/shared/types`.
- Edge Functions devuelven contratos estables y versionables.

---

## III. UI/UX: Sistema de Diseño Atómico (Atomic Vibe)

### 1) Tokenización (sin magic numbers)
No hardcodear colores/tamaños (ni `#00FF..` ni `12px` sin token).
- Tokens en `src/shared/ui/tokens` (CSS variables o TS):
  - `colors.*`, `spacing.*`, `radius.*`, `shadow.*`, `typography.*`

### 2) Componentización recursiva
Si un bloque UI se usa >1 vez o supera ~20 líneas visuales:
- Extraer a componente en su feature o `shared/ui`.

Componentes esperados:
- `CyberCard`, `NeonButton`, `TimerBar`, `QuestionPanel`, `OptionList`,
- Charts: **preferencia BARRAS** (`CategoryBarChart`), `ScoreTrendLine`, `DonutChart`,
- `GapsTable`, `AdminTable`, `ImportWizard`.

### 3) Resiliencia visual (estados borde)
Todo componente debe manejar:
- `Loading`, `Error`, `Empty`, `DataOverflow` (texto largo/muchas opciones).

### 4) Accesibilidad + mobile-first
- Contraste alto, foco visible, teclado.
- Botones grandes en examen: “Responder / Siguiente”.
- Examen sin distracciones: timer visible, navegación clara.

---

## IV. Estándares de Calidad (Clean Code)

### 1) SOLID pragmático
- Una función/clase = una responsabilidad.
- Extensión por composición, no por herencias profundas.

### 2) Early Return Pattern
Evitar anidamientos excesivos.
- Validar condiciones negativas primero y retornar temprano.

### 3) Manejo de errores (no silenciar)
Nunca tragar errores.
- Propagar a capa que informe al usuario y registre logs.
- UI: mensajes claros + CTA (“Reintentar”, “Volver”).

### 4) Definition of Done (DoD) — obligatorio
Un cambio está “terminado” si:
- Compila + typecheck + lint OK.
- No filtra correctas.
- Timer server-truth intacto.
- RLS/roles no rotos.
- Migración incluida si aplica.
- README actualizado si cambia setup.

---

## V. Reglas específicas del proyecto

### A) Base de Datos y RLS (Supabase)
- `user_profiles.role` define `student/admin`.
- Sesiones/respuestas solo dueño por RLS.
- CRUD sensible solo admin.
- Preguntas/options: el alumno no debe poder consultar `is_correct` desde cliente.

### B) Importador de PDFs (G:\BALOTARIO 2026\BALOTARIOS 2025_2026)
- La web NO lee `G:\` en producción.
- Se exige **script local** que:
  1) Recorrer la ruta y detectar PDFs.
  2) Subir PDFs a Supabase Storage (bucket `source-pdfs`).
  3) Extraer texto si es posible; si es escaneado, `requires_ocr=true`.
  4) Generar preguntas en `draft` (no inventar).
  5) Registrar `source_documents` + `import_jobs` + logs.
- Admin revisa y activa (`draft → active`).

### C) Fuentes vigentes (legal refs)
- Guardar referencias en `legal_refs` con `fetched_at`.
- Usar APIs de búsqueda/feeds; evitar scraping agresivo.
- Vinculación opcional de refs a preguntas/explicaciones.

---

## VI. Regla de “Una Cosa a la Vez” (anti-caos)
Cada entrega debe caer en UNA sola categoría:
1) Exam Runner + Timer
2) Dashboard (Alumno/Admin)
3) Admin CRUD + Plantillas
4) Importador PDFs + Control de calidad
5) Fuentes vigentes (legal refs)

Si mezcla 2+, dividir en cambios atómicos.

---

## VII. Meta-instrucción de Auto-Corrección (check final)
Antes de responder con código final, verifica:
1) ¿Respeté SoC y arquitectura por features?
2) ¿No hay forma de filtrar `is_correct` al cliente?
3) ¿El timer depende de `ends_at` server-truth y valida en servidor?
4) ¿Usé tokens y componentes reutilizables?
5) ¿Compila y es un cambio completo?

Si alguna respuesta es “no”, refactoriza antes de entregar.

FIN (Always On)
