"use client"

import { cn } from "@/shared/lib/utils";

interface ExamNavProps {
    totalQuestions: number;
    currentQuestionIndex: number;
    answers: Record<string, string[]>;
    flagged: string[];
    onNavigate: (index: number) => void;
    questions: { id: string }[];
}

export function ExamNav({
    totalQuestions,
    currentQuestionIndex,
    onNavigate,
    answers,
    flagged,
    questions
}: ExamNavProps) {
    return (
        <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto p-2">
            {questions.map((q, idx) => {
                const isAnswered = answers[q.id]?.length > 0;
                const isFlagged = flagged.includes(q.id);
                const isCurrent = currentQuestionIndex === idx;

                return (
                    <button
                        key={q.id}
                        onClick={() => onNavigate(idx)}
                        className={cn(
                            "h-8 w-8 rounded flex items-center justify-center text-xs font-medium transition-all border",
                            isCurrent
                                ? "border-primary bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                                : "border-border bg-card hover:bg-accent",
                            isFlagged && !isCurrent && "border-destructive text-destructive bg-destructive/10",
                            isAnswered && !isCurrent && !isFlagged && "bg-primary/20 text-primary border-primary/30"
                        )}
                    >
                        {isFlagged ? "!" : idx + 1}
                    </button>
                )
            })}
        </div>
    )
}
