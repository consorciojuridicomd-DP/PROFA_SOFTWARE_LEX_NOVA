"use client"

import { CyberCard } from "@/shared/ui/CyberCard"
import { NeonButton } from "@/shared/ui/NeonButton"
import { Eye, FileText, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock data for results history
const mockResults = [
    { id: "1", examName: "Simulacro General 31° PROFA", date: "2024-02-13", score: 14, maxScore: 20, correct: 45, total: 60, status: "Completado" },
    { id: "2", examName: "Práctica Penal - Teoría del Delito", date: "2024-02-12", score: 16, maxScore: 20, correct: 18, total: 20, status: "Completado" },
    { id: "3", examName: "Simulacro Civil - Obligaciones", date: "2024-02-10", score: 12, maxScore: 20, correct: 35, total: 60, status: "Completado" },
]

export default function ResultsIndexPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Mis Resultados</h2>
                <p className="text-muted-foreground">Historial detallado de tus simulacros y prácticas.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CyberCard className="bg-card/50">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <span className="text-sm font-medium text-muted-foreground">Exámenes Rendidos</span>
                        <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">12</div>
                </CyberCard>
                <CyberCard className="bg-card/50">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <span className="text-sm font-medium text-muted-foreground">Promedio General</span>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">14.5</div>
                </CyberCard>
            </div>

            <CyberCard title="Últimos Resultados">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-border">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Examen</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nota</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Preguntas</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {mockResults.map((result) => (
                                <tr key={result.id} className="border-b border-border transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{result.examName}</td>
                                    <td className="p-4 align-middle flex items-center gap-2">
                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                        {result.date}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className={`font-bold ${result.score >= 14 ? "text-green-500" : "text-yellow-500"}`}>
                                            {result.score.toFixed(2)}
                                        </span>
                                        <span className="text-muted-foreground text-xs"> / {result.maxScore}</span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        {result.correct} / {result.total}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Link href={`/app/results/${result.id}`}>
                                            <NeonButton size="sm" variant="ghost" className="h-8 gap-2">
                                                <Eye className="h-4 w-4" /> Ver
                                            </NeonButton>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CyberCard>
        </div>
    )
}
