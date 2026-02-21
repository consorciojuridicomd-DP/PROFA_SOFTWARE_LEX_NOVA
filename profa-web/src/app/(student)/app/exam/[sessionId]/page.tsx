"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  VIEW — MVC  (Capa de Presentación)                             ║
 * ║  exam/[sessionId]/page.tsx                                      ║
 * ║                                                                  ║
 * ║  Esta página SOLO renderiza estado y dispara eventos.           ║
 * ║  Toda la lógica vive en:                                        ║
 * ║    Controller → features/exam/hooks/useExamRunner.ts            ║
 * ║    Model      → features/exam/services/exam.service.ts          ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useParams, useRouter } from "next/navigation";
import { useExamRunner } from "@/features/exam/hooks/useExamRunner";
import { QuestionPanel } from "@/features/exam/components/QuestionPanel";
import { TimerBar } from "@/features/exam/components/TimerBar";
import { ExamNav } from "@/features/exam/components/ExamNav";
import { NeonButton } from "@/shared/ui/NeonButton";
import { ChevronLeft, ChevronRight, Save, AlertTriangle } from "lucide-react";

export default function ExamRunnerPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;

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

    // ── Estados de Borde ─────────────────────────────────────────────────────
    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <div className="p-8 text-center animate-pulse text-primary font-bold">Cargando examen...</div>
        </div>
    );

    if (!session) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="text-destructive font-bold text-xl">Error al cargar la sesión</div>
            <NeonButton onClick={() => router.push('/app/select')}>Volver</NeonButton>
        </div>
    );

    if (!currentQuestion) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <div className="text-destructive font-bold text-xl">
                    ⚠️ No hay preguntas cargadas.
                </div>
                <NeonButton onClick={() => router.push('/app/select')}>
                    Volver a Configuración
                </NeonButton>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-6 relative">

            {/* Modal de Finalización */}
            {showFinishModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-card border border-border p-6 rounded-xl shadow-2xl max-w-md w-full">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold">¿Finalizar Examen?</h3>
                            <p className="text-muted-foreground text-sm">
                                Has respondido {Object.keys(session.responses).length} de {session.questions.length} preguntas.
                                Una vez finalizado, no podrás cambiar tus respuestas.
                            </p>
                            <div className="flex gap-3 w-full mt-4">
                                <NeonButton variant="outline" className="flex-1" onClick={() => setShowFinishModal(false)}>
                                    Cancelar
                                </NeonButton>
                                <NeonButton className="flex-1" onClick={handleFinishExam} disabled={finishing}>
                                    {finishing ? "Finalizando..." : "Sí, Finalizar"}
                                </NeonButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col gap-6">
                {/* Cabecera con Timer */}
                <div className="flex items-center justify-between bg-card/50 p-4 rounded-xl border border-border">
                    <h2 className="font-bold text-lg hidden sm:block">Simulacro en Progreso</h2>
                    <h2 className="font-bold text-sm sm:hidden">Examen</h2>
                    {session.endsAt ? (
                        <TimerBar endsAt={new Date(session.endsAt)} onExpire={onTimerExpire} />
                    ) : (
                        <span className="text-primary font-mono font-bold">Tiempo Libre</span>
                    )}
                </div>

                {/* Panel de Pregunta */}
                <div className="flex-1 overflow-y-auto">
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

                {/* Navegación Inferior */}
                <div className="flex justify-between items-center py-4 bg-background/80 backdrop-blur-sm sticky bottom-0">
                    <NeonButton
                        variant="outline"
                        onClick={prevQuestion}
                        disabled={isFirstQuestion}
                        className="gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" /> Anterior
                    </NeonButton>

                    <NeonButton
                        onClick={nextQuestion}
                        disabled={isLastQuestion}
                        className="gap-2"
                    >
                        Siguiente <ChevronRight className="h-4 w-4" />
                    </NeonButton>
                </div>
            </div>

            {/* Navegación Lateral (Solo Desktop) */}
            <div className="w-80 hidden lg:flex flex-col gap-4">
                <div className="bg-card/50 rounded-xl border border-border p-4 flex flex-col h-full">
                    <h3 className="font-semibold mb-4">Hoja de Respuestas</h3>
                    <div className="flex-1 overflow-hidden">
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
                        <div className="flex gap-4 text-xs text-muted-foreground mb-4 justify-around">
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-primary/20 border border-primary/30 rounded" /> Resp.</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-destructive/10 border border-destructive rounded" /> Duda</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-card border border-border rounded" /> Pend.</div>
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
    )
}
