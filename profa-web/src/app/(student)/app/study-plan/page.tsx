"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

import { CyberCard } from "@/shared/ui/CyberCard"
import { NeonButton } from "@/shared/ui/NeonButton"
import { CommunitySection } from "@/shared/ui/CommunitySection"
import { BookOpen, Play, Video, TrendingUp, AlertCircle, CheckCircle2, FileText, X, ChevronRight } from "lucide-react"
import { MOCK_RECOMMENDATIONS, StudyRecommendation, KNOWLEDGE_BASE, Category, Topic } from "@/features/study-plan/data"



export default function StudyPlanPage() {
    const [selectedMaterial, setSelectedMaterial] = useState<StudyRecommendation | null>(null);

    // State for Cascade Selection
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedTopic, setSelectedTopic] = useState<string>("");
    const [selectedSubtopic, setSelectedSubtopic] = useState<string>("");

    // Load initial state (optional: persist)
    // For now, default to first category if none selected
    useEffect(() => {
        if (!selectedCategory && KNOWLEDGE_BASE.length > 0) {
            setSelectedCategory(KNOWLEDGE_BASE[0].id);
        }
    }, []);

    // Handlers for Cascade Logic
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setSelectedTopic("");
        setSelectedSubtopic("");
    };

    const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTopic(e.target.value);
        setSelectedSubtopic("");
    };

    const handleSubtopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubtopic(e.target.value);
    };

    // Helpers to get current objects
    const currentCategory = KNOWLEDGE_BASE.find(c => c.id === selectedCategory);
    const currentTopic = currentCategory?.topics.find(t => t.id === selectedTopic);
    const currentSubtopic = currentTopic?.subtopics.find(s => s.id === selectedSubtopic);

    const handleVerClase = (topic: string) => {
        const query = encodeURIComponent(`Derecho Perú ${topic} explicacion`);
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    };

    const handleLeerMaterial = (rec: StudyRecommendation) => {
        setSelectedMaterial(rec);
    };

    // Filter Logic
    // We want to show cards ONLY if we have valid selection? 
    // Or we show relevant cards for the selection?
    // The requirement says: "Ninguna tarjeta... se puede ejecutar... si no se ha elegido el SUBTEMA."
    // It also implies we show cards relevant to the selection.

    // Let's filter MOCK data. If we find a specific recommendation for this subtopic, great.
    // If not, we might generate a generic one based on the selection to ensure UI isn't empty.

    let activeRecommendations = MOCK_RECOMMENDATIONS.filter(r =>
        r.categoryId === selectedCategory &&
        (selectedTopic ? r.topicId === selectedTopic : true) &&
        (selectedSubtopic ? r.subtopicId === selectedSubtopic : true)
    );

    // Contextual Title for Card
    const cardTitle = currentSubtopic ? `${currentCategory?.name} > ${currentTopic?.name} > ${currentSubtopic.name}` :
        currentTopic ? `${currentCategory?.name} > ${currentTopic.name}` :
            currentCategory?.name || "Selecciona una materia";

    // GENERATIVE FALLBACK: If no mock data exists for the specific selection, create a placeholder
    // so the user sees "High Priority", "Medium", etc. for their selection.
    if (activeRecommendations.length === 0 && selectedCategory) {
        // Fallback recommendations logic
        activeRecommendations = [
            {
                id: "gen_high",
                topic: currentTopic?.name || "General",
                subtopic: currentSubtopic?.name || "General",
                category: currentCategory?.name || "",
                categoryId: selectedCategory,
                topicId: selectedTopic || "gen",
                subtopicId: selectedSubtopic || "gen",
                priority: "High",
                mastery: 30, // Low mastery to prompt action
                goal: 80,
                recommendedAction: "Quiz",
                reason: "Prioridad calculada para este nuevo tema.",
                estimatedTime: "20 min"
            },
            {
                id: "gen_med",
                topic: currentTopic?.name || "General",
                subtopic: currentSubtopic?.name || "General",
                category: currentCategory?.name || "",
                categoryId: selectedCategory,
                topicId: selectedTopic || "gen",
                subtopicId: selectedSubtopic || "gen",
                priority: "Medium",
                mastery: 50,
                goal: 75,
                recommendedAction: "Video",
                reason: "Refuerzo conceptual recomendado.",
                estimatedTime: "15 min"
            }
        ];
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto relative">
            {/* Modal for Reading Material */}
            {selectedMaterial && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-card border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-border">
                            <div>
                                <h3 className="text-xl font-bold">{selectedMaterial.topic}</h3>
                                <p className="text-sm text-primary">{selectedMaterial.category} - {selectedMaterial.subtopic}</p>
                            </div>
                            <button onClick={() => setSelectedMaterial(null)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-4">
                            <div className="p-4 bg-secondary/20 rounded-lg border border-secondary">
                                <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-primary" />
                                    ¿Por qué estudiar esto?
                                </p>
                                <p className="text-sm text-muted-foreground">{selectedMaterial.reason}</p>
                            </div>
                            <div className="prose dark:prose-invert max-w-none">
                                <p>Contenido simulado para <strong>{selectedMaterial.subtopic}</strong>...</p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-border flex justify-end gap-3">
                            <NeonButton variant="outline" onClick={() => setSelectedMaterial(null)}>Cerrar</NeonButton>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Plan de Estudio Inteligente</h2>
                    <p className="text-muted-foreground">Configura tu sesión de estudio paso a paso.</p>
                </div>

                {/* CASCADE SELECTORS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-card/50 border border-border rounded-xl backdrop-blur-sm">
                    {/* 1. Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">1. Materia</label>
                        <select
                            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            <option value="" disabled>Seleccionar Materia</option>
                            {KNOWLEDGE_BASE.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 2. Topic */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">2. Tema</label>
                        <select
                            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                            value={selectedTopic}
                            onChange={handleTopicChange}
                            disabled={!selectedCategory}
                        >
                            <option value="">Seleccionar Tema</option>
                            {currentCategory?.topics.map(topic => (
                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 3. Subtopic */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">3. Subtema (Obligatorio)</label>
                        <select
                            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                            value={selectedSubtopic}
                            onChange={handleSubtopicChange}
                            disabled={!selectedTopic}
                        >
                            <option value="">Seleccionar Subtema</option>
                            {currentTopic?.subtopics.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* RECOMMENDATION CARDS */}
            <div className="grid gap-6 md:grid-cols-2">
                {activeRecommendations.map((rec) => (
                    <CyberCard key={rec.id} className="flex flex-col h-full border-l-4 border-l-primary/50 relative overflow-hidden group">

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2
                                    ${rec.priority === 'High' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                                        rec.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                            'bg-green-500/10 text-green-500 border border-green-500/20'
                                    }`}>
                                    {rec.priority === 'High' ? 'Prioridad Alta' : rec.priority === 'Medium' ? 'Prioridad Media' : 'Repaso'}
                                </span>
                                {/* Breadcrumb Title */}
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                    <span>{currentCategory?.name || rec.category}</span>
                                    <ChevronRight className="w-3 h-3" />
                                    <span>{currentTopic?.name || rec.topic}</span>
                                    <ChevronRight className="w-3 h-3" />
                                    <span className="text-primary">{currentSubtopic?.name || rec.subtopic}</span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground">{rec.priority === 'High' ? 'Dominar Concepto' : 'Reforzar Práctica'}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Meta</p>
                                <span className="text-lg font-bold">{rec.goal}%</span>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1 relative z-10">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span>Nivel Actual</span>
                                    <span>{rec.mastery}%</span>
                                </div>
                                <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${rec.mastery < 40 ? 'bg-destructive' : rec.mastery < 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                        style={{ width: `${rec.mastery}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 italic">
                                    {rec.reason}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {rec.recommendedAction === 'Video' && <Video className="w-4 h-4" />}
                                {rec.recommendedAction === 'Quiz' && <CheckCircle2 className="w-4 h-4" />}
                                {rec.recommendedAction === 'Read' && <BookOpen className="w-4 h-4" />}
                                <span>{rec.estimatedTime}</span>
                            </div>

                            <div className="flex gap-2">
                                {/* Actions disabled if Subtopic not selected */}
                                {(!selectedSubtopic) ? (
                                    <div className="text-xs text-orange-500 font-bold flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Selecciona Subtema
                                    </div>
                                ) : (
                                    <>
                                        {rec.recommendedAction === 'Quiz' ? (
                                            <Link href={`/app/select?topic=${encodeURIComponent(categoryToTopic(selectedCategory) || "")}`} className="w-full">
                                                <NeonButton size="sm" className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-primary/50">
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Practicar
                                                </NeonButton>
                                            </Link>
                                        ) : (
                                            <NeonButton
                                                size="sm"
                                                className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/50"
                                                onClick={() => rec.recommendedAction === 'Video' ? handleVerClase(rec.subtopic) : handleLeerMaterial(rec)}
                                            >
                                                {rec.recommendedAction === 'Video' ? <Play className="w-4 h-4 mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                                                {rec.recommendedAction === 'Video' ? 'Ver Clase' : 'Leer Material'}
                                            </NeonButton>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </CyberCard>
                ))}
            </div>

            {/* Community Section */}
            <div className="mt-8">
                <CommunitySection />
            </div>
        </div>
    )
}

// Helper to map ID to legacy topic name for Link compatibility
function categoryToTopic(catId: string): string {
    const map: Record<string, string> = {
        "penal": "Derecho Penal",
        "civil": "Derecho Civil",
        "administrativo": "Derecho Administrativo",
        "procesal_civil": "Procesal Civil",
        "constitucional": "Derecho Constitucional"
    };
    return map[catId] || "Derecho Penal";
}
