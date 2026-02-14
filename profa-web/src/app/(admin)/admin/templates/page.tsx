import { CyberCard } from "@/shared/ui/CyberCard";
import { NeonButton } from "@/shared/ui/NeonButton";
import { BookOpen, Plus, LayoutTemplate } from "lucide-react";

export default function AdminTemplatesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Plantillas de Examen</h2>
                    <p className="text-muted-foreground">Define la estructura para los simulacros (ej. PROFA, JNJ).</p>
                </div>
                <NeonButton className="gap-2">
                    <Plus className="h-4 w-4" /> Nueva Plantilla
                </NeonButton>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <CyberCard className="flex flex-col h-full group hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <LayoutTemplate className="h-6 w-6" />
                        </div>
                        <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs border border-green-500/20">
                            Activa
                        </span>
                    </div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">Simulacro PROFA General</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                        Estructura estándar de 100 preguntas distribuidas en todas las materias. 3 horas de duración.
                    </p>
                    <div className="text-xs text-muted-foreground border-t border-border pt-3 flex justify-between">
                        <span>100 Preguntas</span>
                        <span>180 Minutos</span>
                    </div>
                </CyberCard>

                <CyberCard className="flex flex-col h-full group hover:border-primary/50 transition-colors cursor-pointer border-dashed border-2 bg-transparent">
                    <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <h3 className="font-medium">Crear Plantilla Personalizada</h3>
                        <p className="text-xs text-muted-foreground mt-1 px-4">
                            Configura materias, número de preguntas y tiempo límite.
                        </p>
                    </div>
                </CyberCard>
            </div>
        </div>
    );
}
