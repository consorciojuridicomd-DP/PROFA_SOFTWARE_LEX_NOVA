"use client"

import { CategoryBarChart } from "@/features/dashboard/components/CategoryBarChart";
import { GapsTable } from "@/features/dashboard/components/GapsTable";
import { ScoreTrendLine } from "@/features/dashboard/components/ScoreTrendLine";
import { CyberCard } from "@/shared/ui/CyberCard";
import { CommunitySection } from "@/shared/ui/CommunitySection";
import { getTopRecommendation } from "@/features/study-plan/data";
import { Activity, BookOpen, Target, Trophy } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function DashboardPage() {
    const { user } = useAuth();
    const topRec = getTopRecommendation();
    const firstName = user?.full_name?.split(' ')[0] || "Aspirante";

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground italic">
                    Hola, <span className="text-primary">{firstName}</span>
                </h2>
                <p className="text-muted-foreground">Aquí está tu resumen y progreso de aprendizaje.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CyberCard className="bg-card/50">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <span className="text-sm font-medium text-muted-foreground">Puntaje General</span>
                        <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">14,203</div>
                    <p className="text-xs text-muted-foreground mt-1">+15% vs semana pasada</p>
                </CyberCard>

                <CyberCard className="bg-card/50">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <span className="text-sm font-medium text-muted-foreground">Preguntas Resueltas</span>
                        <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">1,250</div>
                    <p className="text-xs text-muted-foreground mt-1">240 esta semana</p>
                </CyberCard>

                <CyberCard className="bg-card/50">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <span className="text-sm font-medium text-muted-foreground">Precisión Global</span>
                        <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">68.5%</div>
                    <p className="text-xs text-destructive mt-1">-2% vs promedio global</p>
                </CyberCard>

                <CyberCard className="bg-card/50">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <span className="text-sm font-medium text-muted-foreground">Racha Estudio</span>
                        <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">5 Días</div>
                    <p className="text-xs text-muted-foreground mt-1">Mantén el ritmo</p>
                </CyberCard>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <CategoryBarChart />
                </div>
                <div className="col-span-3">
                    <div className="grid gap-4">
                        {/* Weekly Activity Placeholder */}
                        <ScoreTrendLine />
                        <CyberCard title="Próximo Objetivo" className="h-[165px]">
                            <div className="flex flex-col gap-2">
                                <div className="text-sm">Dominar: <span className="text-primary font-bold">{topRec.topic}</span></div>
                                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full w-[45%] ${topRec.mastery < 50 ? 'bg-destructive' : 'bg-primary'}`}
                                        style={{ width: `${topRec.mastery}%` }}
                                    />
                                </div>
                                <div className="text-xs text-right text-muted-foreground">{topRec.mastery}% completado</div>
                            </div>
                        </CyberCard>
                    </div>
                </div>
            </div>




            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <GapsTable />
                </div>
            </div>

            <div className="mt-8">
                <CommunitySection />
            </div>
        </div>
    );
}
