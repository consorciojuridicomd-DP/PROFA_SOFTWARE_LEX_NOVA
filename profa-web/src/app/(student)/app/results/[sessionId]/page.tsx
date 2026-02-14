"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, RotateCcw } from "lucide-react"
import { DonutChart } from "@/features/dashboard/components/DonutChart"
import { CyberCard } from "@/shared/ui/CyberCard"
import { NeonButton } from "@/shared/ui/NeonButton"
import { examService } from "@/features/exam/services/exam.service"
import { ExamSession } from "@/features/exam/types"

export default function ResultsPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;
    const [session, setSession] = useState<ExamSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ score: 0, total: 0, percentage: 0, timeFormatted: "00:00" });

    useEffect(() => {
        async function loadData() {
            if (sessionId) {
                const sess = await examService.getSession(sessionId);
                if (sess) {
                    setSession(sess);
                    // Calculate basic stats for this view
                    // In real app, this should come from a "getResults" endpoint to be secure
                    // For now we replicate the grading logic client-side for the UI
                    let correctCount = 0;
                    sess.questions.forEach(q => {
                        const ans = sess.responses[q.id];
                        if (ans && (ans[0]?.endsWith('1') || ans[0]?.endsWith('5'))) {
                            correctCount++;
                        }
                    });

                    const total = sess.questions.length;
                    const durationMs = sess.endsAt ? (new Date().getTime() - new Date(sess.startedAt).getTime()) : 0;
                    // Note: This duration is just "now - start", technically we should save "finishedAt" in session.
                    // For mock we'll just show a placeholder or diff if available.

                    setStats({
                        score: correctCount,
                        total,
                        percentage: Math.round((correctCount / total) * 100) || 0,
                        timeFormatted: "00:00" // Placeholder as we don't track finish time in mock interface yet
                    });
                }
            }
            setLoading(false);
        }
        loadData();
    }, [sessionId]);

    if (loading) return <div className="p-8 text-center animate-pulse">Calculando resultados...</div>;
    if (!session) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="text-destructive font-bold text-xl">Sesión no encontrada</div>
            <NeonButton onClick={() => router.push('/app/results')}>Volver al Historial</NeonButton>
        </div>
    );

    // Mock category analysis based on the real questions (if they had real categories)
    // We will just group by category string
    const categoryStats: Record<string, { correct: number, total: number }> = {};
    session.questions.forEach(q => {
        if (!categoryStats[q.category]) categoryStats[q.category] = { correct: 0, total: 0 };
        categoryStats[q.category].total++;
        const ans = session.responses[q.id];
        if (ans && (ans[0]?.endsWith('1') || ans[0]?.endsWith('5'))) {
            categoryStats[q.category].correct++;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Resultados del Examen</h2>
                <p className="text-muted-foreground">Sesión: {sessionId}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <CyberCard className="flex flex-col items-center justify-center py-8">
                    <span className="text-muted-foreground text-sm uppercase tracking-wider">Puntaje</span>
                    <span className="text-5xl font-bold text-primary mt-2">{stats.score}</span>
                    <span className="text-xs text-muted-foreground mt-2">de {stats.total}</span>
                </CyberCard>

                <CyberCard className="flex flex-col items-center justify-center py-8">
                    <span className="text-muted-foreground text-sm uppercase tracking-wider">Precisión</span>
                    <span className="text-5xl font-bold text-primary mt-2">{stats.percentage}%</span>
                </CyberCard>

                <CyberCard className="flex flex-col items-center justify-center py-8">
                    <span className="text-muted-foreground text-sm uppercase tracking-wider">Tiempo</span>
                    <span className="text-5xl font-bold text-foreground mt-2">--:--</span>
                    <span className="text-xs text-muted-foreground mt-2">horas</span>
                </CyberCard>

                <CyberCard className="flex flex-col items-center justify-center py-8">
                    <span className="text-muted-foreground text-sm uppercase tracking-wider">Percentil</span>
                    <span className="text-5xl font-bold text-accent mt-2">--</span>
                </CyberCard>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <DonutChart />
                <CyberCard title="Análisis por Categoría" className="min-h-[350px]">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-border">
                                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Categoría</th>
                                    <th className="h-10 px-2 text-center align-middle font-medium text-muted-foreground">Aciertos</th>
                                    <th className="h-10 px-2 text-right align-middle font-medium text-muted-foreground">Rendimiento</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {Object.entries(categoryStats).map(([catName, stat], i) => {
                                    const percentage = Math.round((stat.correct / stat.total) * 100);
                                    let status = 'danger';
                                    if (percentage >= 70) status = 'success';
                                    else if (percentage >= 50) status = 'warning';

                                    return (
                                        <tr key={i} className="border-b border-border transition-colors hover:bg-muted/50">
                                            <td className="p-2 align-middle font-medium">{catName}</td>
                                            <td className="p-2 align-middle text-center">{stat.correct}/{stat.total}</td>
                                            <td className="p-2 align-middle text-right">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${status === 'success' ? 'bg-green-500/10 text-green-500' :
                                                    status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {percentage}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CyberCard>
            </div>

            <div className="flex justify-center gap-4 pt-4">
                <Link href={`/app/review/${sessionId}`}>
                    <NeonButton size="lg" className="gap-2">
                        <Eye className="h-4 w-4" /> Revisar Respuestas
                    </NeonButton>
                </Link>
                <Link href="/app/select">
                    <NeonButton variant="outline" size="lg" className="gap-2">
                        <RotateCcw className="h-4 w-4" /> Nuevo Examen
                    </NeonButton>
                </Link>
            </div>
        </div>
    )
}
