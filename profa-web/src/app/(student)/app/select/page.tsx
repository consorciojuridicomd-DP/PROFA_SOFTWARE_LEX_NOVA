"use client"

export const dynamic = "force-dynamic";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { examService } from "@/features/exam/services/exam.service"
import { ExamConfig } from "@/features/exam/types"
import { CyberCard } from "@/shared/ui/CyberCard"
import { NeonButton } from "@/shared/ui/NeonButton"
import { Clock, HelpCircle, Play, Settings, BookOpen } from "lucide-react"

export default function ExamSelectPage() {
    const router = useRouter();
    const [config, setConfig] = useState<ExamConfig>({
        questionCount: 10,
        durationMinutes: 10,
        topics: []
    });

    const [loading, setLoading] = useState(false);

    // Mock Topics - In real app, fetch from backend (admin configured)
    const knowledgeTopics = [
        "Derecho Penal",
        "Derecho Civil",
        "Derecho Constitucional",
        "Derecho Procesal Penal",
        "Derecho Procesal Civil",
        "Argumentación Jurídica",
        "Derecho Administrativo",
        // New Topics JNJ/PROFA
        "Derecho de la Competencia",
        "Derecho de Propiedad Intelectual",
        "Derecho Registral",
        "Derecho Minero",
        "Derecho Previsional",
        "Derecho Publicitario",
    ];

    const caseTopics = [
        "Casos Prácticos Penal",
        "Casos Prácticos Civil",
        "Casos Prácticos Constitucional",
        "Casos Prácticos Administrativo",
        "Casos Prácticos Laboral",
        "Casos Prácticos Comercial",
        "Casos Prácticos Tributario"
    ];

    // MAP UI TOPICS TO DB MATERIAS/SUBTEMAS
    const TOPIC_MAPPING: Record<string, string> = {
        // Casos Prácticos (Subtemas)
        "Casos Prácticos Penal": "Casos Prácticos de Derecho Penal",
        "Casos Prácticos Civil": "Casos Prácticos de Derecho Civil",
        "Casos Prácticos Constitucional": "Casos Prácticos de Derecho Constitucional",
        "Casos Prácticos Administrativo": "Casos Prácticos de Derecho Administrativo",
        "Casos Prácticos Laboral": "Derecho Laboral",
        "Casos Prácticos Comercial": "Derecho Comercial",
        "Casos Prácticos Tributario": "Derecho Tributario",

        // Conocimientos (Materias) correction
        "Argumentación Jurídica": "Argumentación y Razonamiento Jurídico",

        // Ensure others match exactly if needed (redundancy is fine)
        "Derecho Penal": "Derecho Penal",
        "Derecho Civil": "Derecho Civil",
        "Derecho Constitucional": "Derecho Constitucional",
        "Derecho Administrativo": "Derecho Administrativo",
        "Derecho Procesal Penal": "Derecho Procesal Penal",
        "Derecho Procesal Civil": "Derecho Procesal Civil",
    };

    const handleStart = async () => {
        if (config.questionCount < 1) return;

        setLoading(true);
        try {
            // Translate UI topics to DB topics
            const mappedTopics = config.topics.map(t => TOPIC_MAPPING[t] || t);
            // Remove duplicates and filter potential undefineds
            const uniqueTopics = Array.from(new Set(mappedTopics));

            const session = await examService.startSession({
                ...config,
                topics: uniqueTopics
            });
            router.push(`/app/exam/${session.id}`);
        } catch (error) {
            console.error("Failed to start session", error);
            setLoading(false);
        }
    };

    const toggleTopic = (topic: string) => {
        if (config.topics.includes(topic)) {
            setConfig({ ...config, topics: config.topics.filter(t => t !== topic) });
        } else {
            setConfig({ ...config, topics: [...config.topics, topic] });
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Nuevo Exámen</h2>
                <p className="text-muted-foreground">Configura tu simulacro o práctica personalizada.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Configuration Panel */}
                <CyberCard title="Configuración de Exámen" icon={<Settings className="h-6 w-6" />}>
                    <div className="space-y-6">
                        {/* Questions Count */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-muted-foreground">Cantidad de Preguntas</label>
                            <div className="flex flex-wrap gap-3">
                                {[10, 20, 30, 40, 50].map(count => (
                                    <button
                                        key={count}
                                        onClick={() => setConfig({ ...config, questionCount: count })}
                                        className={`min-w-[50px] flex-1 py-2 px-3 rounded-md border text-sm font-bold transition-all ${config.questionCount === count
                                            ? "border-primary bg-primary/20 text-primary shadow-[0_0_10px_rgba(255,85,0,0.3)]"
                                            : "border-border bg-card hover:bg-accent"
                                            }`}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-muted-foreground">Tiempo Límite</label>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { label: "10 m", val: 10 },
                                    { label: "20 m", val: 20 },
                                    { label: "30 m", val: 30 },
                                    { label: "40 m", val: 40 },
                                    { label: "Libre", val: null },
                                ].map(opt => (
                                    <button
                                        key={opt.label}
                                        onClick={() => setConfig({ ...config, durationMinutes: opt.val })}
                                        className={`min-w-[60px] flex-1 py-2 px-3 rounded-md border text-sm font-bold transition-all ${config.durationMinutes === opt.val
                                            ? "border-primary bg-primary/20 text-primary shadow-[0_0_10px_rgba(255,85,0,0.3)]"
                                            : "border-border bg-card hover:bg-accent"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Topic Selection */}
                        {/* Topic Selection - KNOWLEDGE */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-muted-foreground">Temas de Conocimientos</label>
                                <button
                                    onClick={() => setConfig({ ...config, topics: config.topics.filter(t => !knowledgeTopics.includes(t)) })}
                                    className="text-[10px] uppercase font-bold text-muted-foreground hover:text-primary transition-colors px-2 py-0.5 border border-border rounded"
                                >
                                    Ninguno
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {knowledgeTopics.map(topic => (
                                    <div
                                        key={topic}
                                        onClick={() => toggleTopic(topic)}
                                        className={`cursor-pointer px-3 py-2 rounded border text-xs transition-colors flex items-center gap-2 ${config.topics.includes(topic)
                                            ? "border-primary bg-primary/10 text-foreground"
                                            : "border-border text-muted-foreground hover:bg-accent"
                                            }`}
                                    >
                                        <div className={`w-3 h-3 rounded-full border ${config.topics.includes(topic) ? "bg-primary border-primary" : "border-muted-foreground"}`} />
                                        {topic}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Topic Selection - PRACTICAL CASES */}
                        <div className="space-y-3 pt-4 border-t border-border">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
                                    <label className="text-sm font-bold text-foreground">Simulación de Casos Prácticos</label>
                                </div>
                                <button
                                    onClick={() => setConfig({ ...config, topics: config.topics.filter(t => !caseTopics.includes(t)) })}
                                    className="text-[10px] uppercase font-bold text-muted-foreground hover:text-cyan-400 transition-colors px-2 py-0.5 border border-border rounded"
                                >
                                    Ninguno
                                </button>
                            </div>

                            {/* MIXTURA OPTION */}
                            <div
                                onClick={() => {
                                    const allCases = [
                                        "Casos Prácticos Penal", "Casos Prácticos Civil", "Casos Prácticos Constitucional",
                                        "Casos Prácticos Administrativo", "Casos Prácticos Laboral",
                                        "Casos Prácticos Comercial", "Casos Prácticos Tributario"
                                    ];
                                    const allSelected = allCases.every(t => config.topics.includes(t));
                                    if (allSelected) {
                                        setConfig({ ...config, topics: config.topics.filter(t => !allCases.includes(t)) });
                                    } else {
                                        const otherTopics = config.topics.filter(t => !allCases.includes(t));
                                        setConfig({ ...config, topics: [...otherTopics, ...allCases] });
                                    }
                                }}
                                className={`cursor-pointer w-full px-4 py-3 mb-3 rounded border text-sm font-bold transition-all flex items-center justify-center gap-3 ${caseTopics.every(t => config.topics.includes(t))
                                    ? "border-cyan-400 bg-cyan-500/20 text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                                    : "border-border bg-card/50 hover:bg-accent"
                                    }`}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${caseTopics.every(t => config.topics.includes(t)) ? "bg-cyan-400 border-cyan-400" : "border-muted-foreground"}`}>
                                    {caseTopics.every(t => config.topics.includes(t)) && <div className="w-2 h-2 bg-black rounded-full" />}
                                </div>
                                SIMULACRO GENERAL / MIXTURA (Todas las Materias)
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {caseTopics.map(topic => (
                                    <div
                                        key={topic}
                                        onClick={() => toggleTopic(topic)}
                                        className={`cursor-pointer px-3 py-3 rounded border text-xs font-medium transition-colors flex items-center gap-2 ${config.topics.includes(topic)
                                            ? "border-cyan-500 bg-cyan-950/30 text-cyan-100 shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                                            : "border-border text-muted-foreground hover:bg-accent"
                                            }`}
                                    >
                                        <div className={`w-3 h-3 rounded-full border ${config.topics.includes(topic) ? "bg-cyan-400 border-cyan-400" : "border-muted-foreground"}`} />
                                        {topic}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">* Si no seleccionas ninguno, se incluirán todos los temas.</p>
                    </div>
                </CyberCard>

                {/* Summary & Action */}
                <div className="flex flex-col gap-6">
                    <CyberCard title="Resumen" className="flex-1 bg-gradient-to-br from-card to-background">
                        <div className="flex flex-col h-full justify-center items-center gap-6 py-6">
                            <div className="text-center">
                                <span className="block text-sm text-muted-foreground mb-1">Modo</span>
                                <span className="text-xl font-bold text-foreground">
                                    {config.durationMinutes ? "Simulacro con Tiempo" : "Práctica Libre"}
                                </span>
                            </div>

                            <div className="flex gap-8">
                                <div className="flex flex-col items-center">
                                    <HelpCircle className="h-6 w-6 text-primary mb-2" />
                                    <span className="text-2xl font-bold">{config.questionCount}</span>
                                    <span className="text-xs text-muted-foreground">Preguntas</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Clock className="h-6 w-6 text-primary mb-2" />
                                    <span className="text-2xl font-bold">
                                        {config.durationMinutes ? `${config.durationMinutes} m` : "∞"}
                                    </span>
                                    <span className="text-xs text-muted-foreground">Minutos</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <BookOpen className="h-6 w-6 text-primary mb-2" />
                                    <span className="text-2xl font-bold">
                                        {config.topics.length === 0 ? "Todos" : config.topics.length}
                                    </span>
                                    <span className="text-xs text-muted-foreground">Temas</span>
                                </div>
                            </div>
                        </div>
                    </CyberCard>

                    <NeonButton
                        onClick={handleStart}
                        size="lg"
                        className="w-full h-14 text-lg gap-2"
                        disabled={loading}
                    >
                        {loading ? "Generando..." : <><Play className="h-5 w-5" /> COMENZAR EXÁMEN</>}
                    </NeonButton>
                </div>
            </div>
        </div>
    )
}
