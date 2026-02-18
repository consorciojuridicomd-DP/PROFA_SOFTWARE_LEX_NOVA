# Reglas de Buena Práctica (Always On)
## Proyecto: APP 31° PROFA – Evaluación Aspirantes (Jueces/Fiscales) + Dashboard (Next.js + Supabase)

> **PRIME DIRECTIVE:** Actúa como **Arquitecto de Sistemas Principal**.  
> Maximiza la **velocidad de desarrollo (Vibe)** sin sacrificar la **integridad estructural (Solidez)**.  
> Estás en entorno multi-agente: cada entrega debe ser **atómica**, **explicable**, **compilable** y **no destructiva**.

---

## VII. REGLA DE PROHIBICIÓN (Inmutabilidad de UI) - [BLOQUEO ACTIVO]
> [!CAUTION]
> **PROHIBICIÓN ESTRICTA:** Los siguientes segmentos de la Landing Page han sido declarados como **ARREGLADOS Y FINALIZADOS**.  
> **NO TOCAR, NO MOVER, NO REDISEÑAR** sin autorización expresa del usuario.

### Segmentos Protegidos:
1. **Tarjetas de Características (Sección 8)**: Textos exactos, alineación horizontal dentro del Hero, estética backdrop-blur con borde naranja.
2. **Panel de Comunidad (Sección 9)**: Alineación de ancho (914px), contenido de contactos (Teléfonos y Gmails en Mayúsculas), botones sociales cuadrados ubicados debajo de los contactos (Optimizado para Móvil).
3. **Créditos Finales (Sección 10)**: Formato de Mg. Sergio J. De la Cruz Zúñiga (Blanco negrita) y especialidad (Naranja mayúsculas).
4. **Botón de Salida (Logout)**: Icono destellante (Power) con efecto ping rojo, tooltip descriptivo "Abandonar el sistema por completo" posicionado a la izquierda, y redirección externa (fuera del aplicativo).
5. **Estética General**: Visibilidad del robot (object-contain), efecto nieve (1-3px), y atmósfera cyber-tech.

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
1) **Separación Estricta de Responsabilidades (SoC)**
2) **Arquitectura por Features (obligatoria)**
3) **Fronteras de Seguridad (No leaks)**
4) **Timer antifraude (Server Truth)**
5) **Agnosticismo de Dependencias (Wrappers/Adapters)**
6) **Inmutabilidad por defecto**

## II. Protocolo de Conservación de Contexto (Multi-Agent Memory)
1) **Regla de Chesterton’s Fence**
2) **Código auto-documentado**
3) **Atomicidad (siempre compila)**
4) **Contract-First**

## III. UI/UX: Sistema de Diseño Atómico (Atomic Vibe)
1) **Tokenización (sin magic numbers)**
2) **Componentización recursiva**
3) **Resiliencia visual (estados borde)**
4) **Accesibilidad + mobile-first**

## IV. Estándares de Calidad (Clean Code)
1) **SOLID pragmático**
2) **Early Return Pattern**
3) **Manejo de errores (no silenciar)**
4) **Definition of Done (DoD) — obligatorio**

## V. Reglas específicas del proyecto
A) **Base de Datos y RLS (Supabase)**
B) **Importador de PDFs (G:\BALOTARIO 2026\BALOTARIOS 2025_2026)**
C) **Fuentes vigentes (legal refs)**

---

**NOTA:** Esta "Regla de Prohibición" prevalece sobre cualquier intento de mejora estética o funcional automática en la landing page.
