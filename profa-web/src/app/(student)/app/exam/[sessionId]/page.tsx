"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { examService } from "@/features/exam/services/exam.service"
import { ExamSession } from "@/features/exam/types"
import { QuestionPanel } from "@/features/exam/components/QuestionPanel"
import { TimerBar } from "@/features/exam/components/TimerBar"
import { ExamNav } from "@/features/exam/components/ExamNav"
import { NeonButton } from "@/shared/ui/NeonButton"
import { ChevronLeft, ChevronRight, Save, AlertTriangle } from "lucide-react"

export default function ExamRunnerPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;

    const [session, setSession] = useState<ExamSession | null>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showFinishModal, setShowFinishModal] = useState(false);

    useEffect(() => {
        async function loadSession() {
            if (sessionId) {
                const sess = await examService.getSession(sessionId);
                setSession(sess);
            }
            setLoading(false);
        }
        loadSession();
    }, [sessionId]);

    if (loading) return <div className="p-8 text-center animate-pulse">Cargando examen...</div>;
    if (!session) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="text-destructive font-bold text-xl">Error al cargar la sesión</div>
            <NeonButton onClick={() => router.push('/app/select')}>Volver</NeonButton>
        </div>
    );

    const currentQuestion = session.questions[currentIdx];

    const handleOptionSelect = (optionId: string) => {
        if (!session) return;
        const newResponses = { ...session.responses, [currentQuestion.id]: [optionId] };
        setSession({ ...session, responses: newResponses });
        examService.submitAnswer(session.id, currentQuestion.id, [optionId]);
    };

    const handleFlag = () => {
        if (!session) return;
        const isFlagged = session.flagged.includes(currentQuestion.id);
        const newFlagged = isFlagged
            ? session.flagged.filter(id => id !== currentQuestion.id)
            : [...session.flagged, currentQuestion.id];

        setSession({ ...session, flagged: newFlagged });
    };

    const handleFinishExam = async () => {
        setLoading(true);
        console.log("Finishing exam:", session.id);
        const result = await examService.finishSession(session.id);
        console.log("Result:", result);
        router.push(`/app/results/${session.id}`);
    };

    const onTimerExpire = () => {
        alert("¡Tiempo terminado! El examen se enviará automáticamente.");
        handleFinishExam();
    };

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-6 relative">
            {/* Finish Confirmation Modal Overlay */}
            {showFinishModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-card border border-border p-6 rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
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
                                <NeonButton className="flex-1" onClick={handleFinishExam}>
                                    Sí, Finalizar
                                </NeonButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col gap-6">
                <div className="flex items-center justify-between bg-card/50 p-4 rounded-xl border border-border">
                    <h2 className="font-bold text-lg">Simulacro en Progreso</h2>
                    {session.endsAt ? (
                        <TimerBar endsAt={new Date(session.endsAt)} onExpire={onTimerExpire} />
                    ) : (
                        <span className="text-primary font-mono font-bold">Tiempo Libre</span>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto">
                    <QuestionPanel
                        question={currentQuestion}
                        questionNumber={currentIdx + 1}
                        totalQuestions={session.questions.length}
                        selectedOptions={session.responses[currentQuestion.id] || []}
                        onOptionSelect={handleOptionSelect}
                        onFlag={handleFlag}
                        isFlagged={session.flagged.includes(currentQuestion.id)}
                    />
                </div>

                <div className="flex justify-between items-center py-4">
                    <NeonButton
                        variant="outline"
                        onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                        disabled={currentIdx === 0}
                        className="gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" /> Anterior
                    </NeonButton>

                    <NeonButton
                        onClick={() => setCurrentIdx(Math.min(session.questions.length - 1, currentIdx + 1))}
                        disabled={currentIdx === session.questions.length - 1}
                        className="gap-2"
                    >
                        Siguiente <ChevronRight className="h-4 w-4" />
                    </NeonButton>
                </div>
            </div>

            <div className="w-80 hidden lg:flex flex-col gap-4">
                <div className="bg-card/50 rounded-xl border border-border p-4 flex flex-col h-full">
                    <h3 className="font-semibold mb-4">Navegación</h3>
                    <div className="flex-1 overflow-hidden">
                        <ExamNav
                            totalQuestions={session.questions.length}
                            currentQuestionIndex={currentIdx}
                            answers={session.responses}
                            flagged={session.flagged}
                            onNavigate={setCurrentIdx}
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
                            className="w-full gap-2 hover:bg-destructive/20 hover:text-destructive transition-colors"
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
