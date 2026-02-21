"use client";

/**
 * ExamRunnerPage - Vista del runner de examen
 * Layout responsivo: móvil-first con botón Finalizar siempre visible
 */

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExamRunner } from "@/features/exam/hooks/useExamRunner";
import { QuestionPanel } from "@/features/exam/components/QuestionPanel";
import { TimerBar } from "@/features/exam/components/TimerBar";
import { ExamNav } from "@/features/exam/components/ExamNav";
import { NeonButton } from "@/shared/ui/NeonButton";
import {
    ChevronLeft, ChevronRight, Save, AlertTriangle,
    LayoutGrid, X
} from "lucide-react";

export default function ExamRunnerPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;

    // Panel móvil: muestra/oculta la hoja de respuestas
    const [showMobileNav, setShowMobileNav] = useState(false);

    const {
        session,
        currentIdx,
        currentQuestion,
        loading,
        finishing,
        showFinishModal,
        setShowFinishModal,
        isFirstQuestion,
        isLastQuestion,
        nextQuestion,
        prevQuestion,
        goToQuestion,
        handleOptionSelect,
        handleFlag,
        handleFinishExam,
        onTimerExpire
    } = useExamRunner(sessionId);

    // ── Estados de Borde ──────────────────────────────────────────────────────
    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="text-primary font-bold text-lg animate-pulse">Cargando examen...</div>
        </div>
    );

    if (!session) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="text-destructive font-bold text-xl">Error al cargar la sesión</div>
            <NeonButton onClick={() => router.push('/app/select')}>Volver</NeonButton>
        </div>
    );

    if (!currentQuestion) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="text-destructive font-bold text-xl">⚠️ No hay preguntas cargadas.</div>
            <NeonButton onClick={() => router.push('/app/select')}>Volver a Configuración</NeonButton>
        </div>
    );

    return (
        <div className="flex flex-col h-[calc(100dvh-4rem)] md:flex-row md:gap-6 relative">

            {/* ── MODAL FINALIZAR ─────────────────────────────────────────────── */}
            {showFinishModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-card border border-border p-6 rounded-xl shadow-2xl max-w-sm w-full">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold">¿Finalizar Examen?</h3>
                            <p className="text-muted-foreground text-sm">
                                Has respondido{" "}
                                <strong>{Object.keys(session.responses).length}</strong> de{" "}
                                <strong>{session.questions.length}</strong> preguntas.
                            </p>
                            <div className="flex gap-3 w-full mt-2">
                                <NeonButton variant="outline" className="flex-1" onClick={() => setShowFinishModal(false)}>
                                    Cancelar
                                </NeonButton>
                                <NeonButton
                                    className="flex-1 bg-destructive/80 hover:bg-destructive text-white border-destructive"
                                    onClick={handleFinishExam}
                                    disabled={finishing}
                                >
                                    {finishing ? "Finalizando..." : "Sí, Finalizar"}
                                </NeonButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── PANEL MÓVIL: HOJA DE RESPUESTAS (drawer desde abajo) ─────── */}
            {showMobileNav && (
                <div className="fixed inset-0 z-40 md:hidden flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileNav(false)} />
                    <div className="relative bg-card border-t border-border rounded-t-2xl p-4 max-h-[75vh] flex flex-col gap-4 z-10">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-sm">Hoja de Respuestas</h3>
                            <button onClick={() => setShowMobileNav(false)} className="text-muted-foreground hover:text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            <ExamNav
                                totalQuestions={session.questions.length}
                                currentQuestionIndex={currentIdx}
                                answers={session.responses}
                                flagged={session.flagged}
                                onNavigate={(idx) => { goToQuestion(idx); setShowMobileNav(false); }}
                                questions={session.questions}
                            />
                        </div>
                        <div>
                            <div className="flex gap-3 text-xs text-muted-foreground mb-3 justify-around">
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 bg-primary/20 border border-primary/30 rounded inline-block" />
                                    Resp.
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 bg-destructive/10 border border-destructive rounded inline-block" />
                                    Duda
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 border border-border rounded inline-block" />
                                    Pend.
                                </span>
                            </div>
                            <NeonButton
                                variant="secondary"
                                className="w-full gap-2 bg-destructive/20 hover:bg-destructive/40 text-destructive border-destructive/40"
                                onClick={() => { setShowMobileNav(false); setShowFinishModal(true); }}
                            >
                                <Save className="h-4 w-4" /> FINALIZAR EXAMEN
                            </NeonButton>
                        </div>
                    </div>
                </div>
            )}

            {/* ── COLUMNA PRINCIPAL ────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-h-0">

                {/* Header with Timer */}
                <div className="flex items-center justify-between bg-card/50 px-4 py-3 border-b border-border shrink-0">
                    <h2 className="font-bold text-sm md:text-lg truncate">
                        <span className="hidden md:inline">Simulacro en Progreso</span>
                        <span className="md:hidden">Examen</span>
                    </h2>
                    {session.endsAt ? (
                        <TimerBar endsAt={new Date(session.endsAt)} onExpire={onTimerExpire} />
                    ) : (
                        <span className="text-primary font-mono font-bold text-sm">∞ Libre</span>
                    )}
                </div>

                {/* Question Area - scrollable */}
                <div className="flex-1 overflow-y-auto py-2 px-1 md:px-0">
                    <QuestionPanel
                        key={currentQuestion.id}
                        question={currentQuestion}
                        questionNumber={currentIdx + 1}
                        totalQuestions={session.questions.length}
                        selectedOptions={session.responses[currentQuestion.id] || []}
                        onOptionSelect={handleOptionSelect}
                        onFlag={handleFlag}
                        isFlagged={session.flagged.includes(currentQuestion.id)}
                    />
                </div>

                {/* Bottom Nav - siempre visible */}
                <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur-sm px-3 py-2 flex items-center justify-between gap-2">
                    <NeonButton
                        variant="outline"
                        onClick={prevQuestion}
                        disabled={isFirstQuestion}
                        className="gap-1 text-sm px-3 py-2"
                    >
                        <ChevronLeft className="h-4 w-4" /> Anterior
                    </NeonButton>

                    {/* BOTÓN FINALIZAR - solo visible en móvil aquí */}
                    <NeonButton
                        variant="secondary"
                        className="md:hidden gap-1 text-xs px-3 py-2 bg-destructive/20 hover:bg-destructive/40 text-destructive border-destructive/40 shrink-0"
                        onClick={() => setShowFinishModal(true)}
                    >
                        <Save className="h-4 w-4" />
                        Finalizar
                    </NeonButton>

                    {/* Botón hoja de respuestas (móvil) */}
                    <button
                        className="md:hidden flex items-center gap-1 text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded border border-border"
                        onClick={() => setShowMobileNav(true)}
                    >
                        <LayoutGrid className="h-4 w-4" />
                        <span className="hidden sm:inline">Respuestas</span>
                    </button>

                    <NeonButton
                        onClick={nextQuestion}
                        disabled={isLastQuestion}
                        className="gap-1 text-sm px-3 py-2"
                    >
                        Siguiente <ChevronRight className="h-4 w-4" />
                    </NeonButton>
                </div>
            </div>

            {/* ── PANEL LATERAL DESKTOP ───────────────────────────────────────── */}
            <div className="hidden md:flex w-72 flex-col gap-4 shrink-0">
                <div className="bg-card/50 rounded-xl border border-border p-4 flex flex-col h-full">
                    <h3 className="font-semibold mb-4 text-sm">Hoja de Respuestas</h3>
                    <div className="flex-1 overflow-y-auto">
                        <ExamNav
                            totalQuestions={session.questions.length}
                            currentQuestionIndex={currentIdx}
                            answers={session.responses}
                            flagged={session.flagged}
                            onNavigate={goToQuestion}
                            questions={session.questions}
                        />
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex gap-3 text-xs text-muted-foreground mb-3 justify-around">
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-primary/20 border border-primary/30 rounded inline-block" />
                                Resp.
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-destructive/10 border border-destructive rounded inline-block" />
                                Duda
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 border border-border rounded inline-block" />
                                Pend.
                            </span>
                        </div>
                        <NeonButton
                            variant="secondary"
                            className="w-full gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
                            onClick={() => setShowFinishModal(true)}
                        >
                            <Save className="h-4 w-4" /> Finalizar Examen
                        </NeonButton>
                    </div>
                </div>
            </div>

        </div>
    );
}
