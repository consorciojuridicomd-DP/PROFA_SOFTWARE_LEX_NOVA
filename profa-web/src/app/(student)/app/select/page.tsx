"use client";

export const dynamic = "force-dynamic";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  VIEW — MVC  (Capa de Presentación)                             ║
 * ║  select/page.tsx                                                ║
 * ║                                                                  ║
 * ║  Esta página SOLO renderiza estado y dispara eventos.           ║
 * ║  Toda la lógica vive en:                                        ║
 * ║    Controller → features/exam/hooks/useExamConfig.ts            ║
 * ║    Model      → features/exam/services/exam.service.ts          ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import {
    useExamConfig,
    KNOWLEDGE_TOPICS,
    CASE_TOPICS,
    QUESTION_COUNTS,
} from "@/features/exam/hooks/useExamConfig";
import { CyberCard } from "@/shared/ui/CyberCard";
import { NeonButton } from "@/shared/ui/NeonButton";
import {
    Clock, HelpCircle, Play, Settings, BookOpen,
    Info, AlertTriangle, CheckSquare,
} from "lucide-react";

export default function ExamSelectPage() {
    const {
        config,
        availableCount,
        effectiveCount,
        byTopic,
        loadingCount,
        loadingStart,
        error,
        setQuestionCount,
        setDuration,
        toggleTopic,
        clearKnowledge,
        clearCases,
        toggleAllCases,
        handleStart,
    } = useExamConfig();

    // ── Helpers de vista ─────────────────────────────────────────────────────
    const knowledgeSelected = KNOWLEDGE_TOPICS.filter(t => config.topics.includes(t)).length;
    const casesSelected = CASE_TOPICS.filter(t => config.topics.includes(t)).length;
    const allCasesSelected = casesSelected === CASE_TOPICS.length;

    // Badge de disponibilidad para la sección de cantidad
    const renderAvailBadge = () => {
        if (loadingCount) return (
            <span className="text-xs text-muted-foreground animate-pulse">calculando...</span>
        );
        if (availableCount === null) return null;
        const color = availableCount === 0 ? "text-destructive" : "text-green-400";
        const icon = availableCount === 0 ? <AlertTriangle size={12} /> : <Info size={12} />;
        return (
            <span className={`flex items-center gap-1 text-xs font-semibold ${color}`}>
                {icon}
                {availableCount === 0
                    ? "Sin preguntas"
                    : `${availableCount} disponibles${config.topics.length > 0 ? " en estos temas" : ""}`
                }
            </span>
        );
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Encabezado */}
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">Nuevo Exámen</h2>
                <p className="text-muted-foreground">Configura tu simulacro o práctica personalizada.</p>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">

                {/* ── Columna izquierda: Configuración ──────────────────────── */}
                <CyberCard title="Configuración de Exámen" icon={<Settings className="h-6 w-6" />} className="w-full overflow-hidden">
                    <div className="space-y-6">

                        {/* ── Cantidad de Preguntas ─ */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Cantidad de Preguntas
                                </label>
                                {renderAvailBadge()}
                            </div>

                            {/* Aviso de ajuste automático */}
                            {availableCount !== null && config.questionCount > availableCount && availableCount > 0 && (
                                <div className="flex items-center gap-2 p-2 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs">
                                    <AlertTriangle size={12} className="flex-shrink-0" />
                                    Solo hay <strong>{availableCount}</strong> preguntas disponibles.
                                    Se usarán <strong>{effectiveCount}</strong>.
                                </div>
                            )}
                            {availableCount === 0 && config.topics.length > 0 && (
                                <div className="flex items-center gap-2 p-2 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">
                                    <Info size={12} className="flex-shrink-0" />
                                    No hay preguntas para esos temas específicos; el examen usará todas las materias disponibles.
                                </div>
                            )}

                            {/* Botones de cantidad — se deshabilitan si superan el disponible */}
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {QUESTION_COUNTS.map(count => {
                                    const selected = config.questionCount === count;
                                    const needsIA = availableCount !== null && count > availableCount;

                                    return (
                                        <button
                                            key={count}
                                            onClick={() => setQuestionCount(count)}
                                            title={needsIA ? `IA generará ${count - (availableCount || 0)} preguntas para completar tu cupo` : `${count} preguntas disponibles`}
                                            className={`flex-1 min-w-[40px] py-2 px-2 rounded-md border text-xs sm:text-sm font-bold transition-all relative ${selected
                                                ? "border-primary bg-primary/20 text-primary shadow-[0_0_10px_rgba(255,85,0,0.3)]"
                                                : "border-border bg-card hover:bg-accent"
                                                }`}
                                        >
                                            {count}
                                            {needsIA && <span className="absolute -top-1 -right-1 text-[8px] text-cyan-400 font-black animate-pulse">AI</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Tiempo Límite ─ */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-muted-foreground">Tiempo Límite</label>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {[
                                    { label: "10 m", val: 10 },
                                    { label: "20 m", val: 20 },
                                    { label: "30 m", val: 30 },
                                    { label: "40 m", val: 40 },
                                    { label: "Libre", val: null },
                                ].map(opt => (
                                    <button
                                        key={opt.label}
                                        onClick={() => setDuration(opt.val)}
                                        className={`flex-1 min-w-[55px] py-2 px-2 rounded-md border text-xs sm:text-sm font-bold transition-all ${config.durationMinutes === opt.val
                                            ? "border-primary bg-primary/20 text-primary shadow-[0_0_10px_rgba(255,85,0,0.3)]"
                                            : "border-border bg-card hover:bg-accent"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Temas de Conocimientos ─ */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-muted-foreground">Temas de Conocimientos</label>

                            {/* Radiobutton "Todos (sin filtro)" — aparece PRIMERO */}
                            <div
                                onClick={clearKnowledge}
                                className={`cursor-pointer px-3 py-3 rounded-lg border text-xs font-semibold transition-all flex items-center gap-3 ${knowledgeSelected === 0
                                    ? "border-primary bg-primary/10 text-primary shadow-[0_0_8px_rgba(255,85,0,0.15)]"
                                    : "border-border text-muted-foreground hover:bg-accent"
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${knowledgeSelected === 0 ? "border-primary" : "border-muted-foreground/50"
                                    }`}>
                                    {knowledgeSelected === 0 && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                                <span>Todos los temas (sin filtro)</span>
                            </div>

                            {/* Lista de temas específicos */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
                                {KNOWLEDGE_TOPICS.map(topic => {
                                    const count = byTopic[topic] ?? byTopic[topic.replace("Argumentación Jurídica", "Argumentación y Razonamiento Jurídico")] ?? null;
                                    return (
                                        <div
                                            key={topic}
                                            onClick={() => toggleTopic(topic)}
                                            className={`cursor-pointer px-3 py-2.5 rounded border text-[11px] sm:text-xs transition-colors flex items-center justify-between gap-2 h-auto ${config.topics.includes(topic)
                                                ? "border-primary bg-primary/10 text-foreground"
                                                : "border-border text-muted-foreground hover:bg-accent"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`flex-shrink-0 w-3 h-3 rounded-full border ${config.topics.includes(topic) ? "bg-primary border-primary" : "border-muted-foreground"}`} />
                                                <span className="leading-tight">{topic}</span>
                                            </div>
                                            {/* Muestra cuántas preguntas hay para el tema seleccionado */}
                                            {count !== null && config.topics.includes(topic) && (
                                                <span className="text-[9px] text-primary/70 font-bold shrink-0">{count}P</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Casos Prácticos ─ */}
                        <div className="space-y-3 pt-4 border-t border-border">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                                <label className="text-sm font-bold text-foreground">Simulación de Casos Prácticos</label>
                            </div>

                            {/* Radiobutton "Ninguno" — aparece PRIMERO */}
                            <div
                                onClick={clearCases}
                                className={`cursor-pointer px-3 py-3 rounded-lg border text-xs font-semibold transition-all flex items-center gap-3 ${casesSelected === 0
                                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                                    : "border-border text-muted-foreground hover:bg-accent"
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${casesSelected === 0 ? "border-cyan-400" : "border-muted-foreground/50"
                                    }`}>
                                    {casesSelected === 0 && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                                </div>
                                <span>Ninguno (no incluir casos prácticos)</span>
                            </div>

                            {/* Casos individuales — Comportamiento Radio Button Global */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-2 custom-scrollbar">
                                {CASE_TOPICS.map(topic => {
                                    const isSelected = config.topics.includes(topic);
                                    const count = byTopic[topic] ?? null;

                                    return (
                                        <div
                                            key={topic}
                                            onClick={() => toggleTopic(topic)}
                                            className={`cursor-pointer px-3 py-2.5 rounded border text-[11px] sm:text-xs transition-colors flex items-center justify-between gap-2 h-auto ${isSelected
                                                ? "border-cyan-500 bg-cyan-500/10 text-foreground"
                                                : "border-border text-muted-foreground hover:bg-accent"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`flex-shrink-0 w-3 h-3 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-cyan-400" : "border-muted-foreground"
                                                    }`}>
                                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                                                </div>
                                                <span className="leading-tight">{topic}</span>
                                            </div>
                                            {/* Muestra cuántas preguntas hay para el tema seleccionado */}
                                            {count !== null && isSelected && (
                                                <span className="text-[9px] text-cyan-400/70 font-bold shrink-0">{count}P</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <p className="text-[10px] text-muted-foreground">
                            * Si no seleccionas ningún tema, se incluirán todos los disponibles.
                        </p>
                    </div>
                </CyberCard>

                {/* ── Columna derecha: Resumen + Acción ───────────────────── */}
                <div className="flex flex-col gap-6">
                    <CyberCard title="Resumen" className="flex-1 bg-gradient-to-br from-card to-background">
                        <div className="flex flex-col h-full justify-center items-center gap-6 py-6 px-2">

                            {/* Modo */}
                            <div className="text-center">
                                <span className="block text-sm text-muted-foreground mb-1">Modo</span>
                                <span className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                                    {config.durationMinutes ? "Simulacro con Tiempo" : "Práctica Libre"}
                                </span>
                            </div>

                            {/* Métricas */}
                            <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                                {/* Contador — muestra el valor REAL (effectiveCount) */}
                                <div className="flex flex-col items-center">
                                    <HelpCircle className="h-5 w-5 text-primary mb-1" />
                                    <div className="relative flex flex-col items-center">
                                        <span className="text-xl sm:text-2xl font-bold">
                                            {effectiveCount}
                                        </span>
                                        {/* Si fue ajustado, muestra el pedido original tachado */}
                                        {availableCount !== null && config.questionCount > effectiveCount && effectiveCount > 0 && (
                                            <span className="text-[10px] text-destructive line-through opacity-70">
                                                pedido: {config.questionCount}
                                            </span>
                                        )}
                                        {loadingCount && (
                                            <span className="text-[9px] text-muted-foreground animate-pulse">verificando...</span>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-medium">Preguntas</span>
                                </div>

                                {/* Tiempo */}
                                <div className="flex flex-col items-center">
                                    <Clock className="h-5 w-5 text-primary mb-1" />
                                    <span className="text-xl sm:text-2xl font-bold">
                                        {config.durationMinutes ? `${config.durationMinutes} m` : "∞"}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-medium">Minutos</span>
                                </div>

                                {/* Temas */}
                                {/* Temas */}
                                <div className="flex flex-col items-center max-w-[120px]">
                                    <BookOpen className="h-5 w-5 text-primary mb-1" />
                                    <span className="text-xs sm:text-sm font-bold text-center leading-tight line-clamp-2">
                                        {config.topics.length === 0
                                            ? "Todos"
                                            : config.topics.length === 1
                                                ? config.topics[0]
                                                : `${config.topics.length} Temas`}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-medium">Filtro</span>
                                </div>
                            </div>

                            {/* Barra visual de disponibilidad */}
                            {availableCount !== null && availableCount > 0 && (
                                <div className="w-full px-2">
                                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                        <span>Preguntas a usar</span>
                                        <span className="text-primary font-bold">
                                            {effectiveCount} / {availableCount} disponibles
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((effectiveCount / availableCount) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </CyberCard>

                    {/* Error */}
                    {error && (
                        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-2">
                            <AlertTriangle size={14} className="flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Botón iniciar */}
                    <NeonButton
                        onClick={handleStart}
                        size="lg"
                        className="w-full h-14 text-base sm:text-lg gap-2"
                        disabled={loadingStart}
                    >
                        {loadingStart
                            ? "Generando..."
                            : <><Play className="h-5 w-5" /> COMENZAR EXÁMEN</>
                        }
                    </NeonButton>
                </div>
            </div>
        </div>
    );
}
