"use client"

import { useEffect, useState } from "react"
import { CyberCard } from "@/shared/ui/CyberCard"
import { NeonButton } from "@/shared/ui/NeonButton"
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, BookOpen } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { examService } from "@/features/exam/services/exam.service"
import { ExamSession } from "@/features/exam/types"
import ReactMarkdown from 'react-markdown'

export default function ReviewPage() {
    const params = useParams();
    const sessionId = params.sessionId as string;
    const [session, setSession] = useState<ExamSession | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadReview() {
            if (sessionId) {
                const sess = await examService.getReviewSession(sessionId);
                setSession(sess);
            }
            setLoading(false);
        }
        loadReview();
    }, [sessionId]);

    if (loading) return <div className="p-8 text-center animate-pulse">Cargando revisión...</div>;
    if (!session) return <div className="p-8 text-center text-destructive">Sesión no encontrada</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href={`/app/results/${sessionId}`}>
                        <NeonButton variant="outline" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Volver a Resultados</span>
                        </NeonButton>
                    </Link>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Revisión de Examen</h2>
                        <p className="text-muted-foreground text-sm md:text-base">Modo aprendizaje: respuestas y fundamentos.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {session.questions.map((q, idx) => {
                    const userAnswers = session.responses[q.id] || [];
                    const userAnswerId = userAnswers[0]; // Assuming single choice for now
                    const correctId = q.correctOptionId;

                    const isCorrect = userAnswerId === correctId;
                    const isSkipped = !userAnswerId;

                    let statusColor = "border-l-destructive";
                    let StatusIcon = XCircle;
                    let statusText = "Incorrecta";

                    if (isCorrect) {
                        statusColor = "border-l-green-500";
                        StatusIcon = CheckCircle;
                        statusText = "Correcta";
                    } else if (isSkipped) {
                        statusColor = "border-l-yellow-500";
                        StatusIcon = AlertCircle;
                        statusText = "Sin Responder";
                    }

                    return (
                        <CyberCard key={q.id} className={`border-l-4 ${statusColor}`}>
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-lg">Pregunta {idx + 1}</span>
                                    <div className={`flex items-center gap-1 text-sm font-bold ${isCorrect ? "text-green-500" : isSkipped ? "text-yellow-500" : "text-destructive"
                                        }`}>
                                        <StatusIcon className="h-4 w-4" /> {statusText}
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                                    <span className="bg-secondary/50 px-2 py-0.5 rounded text-xs uppercase tracking-wider">{q.category}</span>
                                    {q.difficulty && <span className="bg-secondary/50 px-2 py-0.5 rounded text-xs uppercase tracking-wider">{q.difficulty}</span>}
                                </div>
                                <div className="prose prose-lg dark:prose-invert max-w-none mb-6 text-foreground">
                                    {q.caseContext && (
                                        <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg mb-4 text-sm whitespace-pre-wrap font-mono">
                                            {q.caseContext.trim()}
                                        </div>
                                    )}
                                    <p className="font-medium text-lg leading-relaxed">{q.stem}</p>
                                </div>
                            </div>

                            <div className="space-y-3 pl-4 border-l border-border/50">
                                {q.options.map(opt => {
                                    const isSelected = userAnswerId === opt.id;
                                    const isTarget = correctId === opt.id;

                                    let colorClass = "text-muted-foreground/80";
                                    let bgClass = "";

                                    if (isTarget) {
                                        colorClass = "text-green-500 font-bold";
                                        bgClass = "bg-green-500/10";
                                    }
                                    if (isSelected && !isTarget) {
                                        colorClass = "text-destructive font-bold";
                                        bgClass = "bg-destructive/10";
                                    }

                                    return (
                                        <div key={opt.id} className={`flex items-start gap-3 p-3 rounded-md transition-colors ${bgClass} ${colorClass}`}>
                                            <div className={`mt-1 h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${isTarget ? "border-green-500 bg-green-500" : isSelected ? "border-destructive bg-destructive" : "border-muted-foreground"
                                                }`}>
                                                {(isTarget || isSelected) && <div className="h-2 w-2 bg-background rounded-full" />}
                                            </div>
                                            <span className="flex-1 text-base">{opt.text}</span>
                                            {isTarget && <span className="text-xs font-bold text-green-500 uppercase tracking-wider border border-green-500/50 px-2 py-0.5 rounded ml-2">Correcta</span>}
                                            {isSelected && !isTarget && <span className="text-xs font-bold text-destructive uppercase tracking-wider border border-destructive/50 px-2 py-0.5 rounded ml-2">Tu respuesta</span>}
                                        </div>
                                    )
                                })}
                            </div>

                            {q.explanation && (
                                <div className="mt-8 pt-6 border-t border-border/50">
                                    <div className="bg-secondary/30 rounded-lg p-5 border border-border/50">
                                        <div className="flex items-center gap-2 mb-3 text-primary font-semibold">
                                            <BookOpen className="h-5 w-5" />
                                            <h4 className="text-lg">Fundamentación Jurídica</h4>
                                        </div>
                                        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground">
                                            <ReactMarkdown>{q.explanation}</ReactMarkdown>
                                        </div>
                                        {q.source && (
                                            <div className="mt-4 pt-3 border-t border-border/30 text-xs text-muted-foreground italic flex items-center gap-1">
                                                <span className="font-semibold">Fuente:</span>
                                                {q.sourceUrl ? (
                                                    <a href={q.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                                        {q.source} <span className="sr-only">Enlace externo</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                                    </a>
                                                ) : q.source}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CyberCard>
                    )
                })}
            </div>

            <div className="flex justify-center pt-8 pb-12">
                <Link href={`/app/results/${sessionId}`}>
                    <NeonButton size="lg" className="gap-3 px-8 shadow-lg shadow-primary/20">
                        <ArrowLeft className="h-5 w-5" />
                        Volver al Menú de Resultados
                    </NeonButton>
                </Link>
            </div>
        </div>
    )
}
