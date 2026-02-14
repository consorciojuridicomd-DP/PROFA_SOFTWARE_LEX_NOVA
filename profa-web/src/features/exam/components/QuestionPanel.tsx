"use client"

import { Question } from "../types"
import { OptionList } from "./OptionList"
import { CyberCard } from "@/shared/ui/CyberCard"
import { Flag } from "lucide-react"
import { NeonButton } from "@/shared/ui/NeonButton"

interface QuestionPanelProps {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    selectedOptions: string[];
    onOptionSelect: (optionId: string) => void;
    onFlag: () => void;
    isFlagged: boolean;
}

export function QuestionPanel({
    question,
    questionNumber,
    totalQuestions,
    selectedOptions,
    onOptionSelect,
    onFlag,
    isFlagged
}: QuestionPanelProps) {
    return (
        <CyberCard className="min-h-[400px] flex flex-col">
            <div className="flex justify-between items-start mb-6 border-b border-border pb-4">
                <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                        {question.category}
                    </span>
                    <h3 className="text-xl font-bold mt-1">
                        Pregunta {questionNumber} <span className="text-muted-foreground text-base font-normal">/ {totalQuestions}</span>
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <NeonButton variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <span className="sr-only">Ayuda</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                        </NeonButton>
                        <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-popover border border-border rounded-md shadow-xl text-xs text-popover-foreground z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <p className="font-semibold mb-1">Marcar como Dudosa</p>
                            <p>Utiliza esta opción para resaltar preguntas sobre las que tienes dudas. Podrás revisarlas fácilmente antes de finalizar el examen usando el panel de navegación.</p>
                        </div>
                    </div>
                    <NeonButton
                        variant={isFlagged ? "destructive" : "outline"}
                        size="sm"
                        onClick={onFlag}
                        className="gap-2"
                    >
                        <Flag className="h-4 w-4" />
                        {isFlagged ? "Marcada" : "Marcar Dudosa"}
                    </NeonButton>
                </div>
            </div>

            <div className="flex-1 space-y-8">
                {question.caseContext && (
                    <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-md">
                        <h4 className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">Hechos del Caso</h4>
                        <div className="prose prose-sm prose-invert max-w-none text-foreground/90 whitespace-pre-wrap">
                            {question.caseContext.trim()}
                        </div>
                    </div>
                )}

                <p className="text-lg leading-relaxed text-foreground font-medium">
                    {question.stem}
                </p>

                <OptionList
                    options={question.options}
                    selectedIds={selectedOptions}
                    onSelect={onOptionSelect}
                />
            </div>
        </CyberCard>
    )
}
