"use client"

import { cn } from "@/shared/lib/utils"
import { Option } from "../types"

interface OptionListProps {
    options: Option[];
    selectedIds?: string[];
    onSelect: (optionId: string) => void;
    multiSelect?: boolean;
}

export function OptionList({ options, selectedIds = [], onSelect, multiSelect = false }: OptionListProps) {
    return (
        <div className="space-y-3">
            {options.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                return (
                    <button
                        key={option.id}
                        onClick={() => onSelect(option.id)}
                        className={cn(
                            "w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-start gap-3",
                            isSelected
                                ? "border-primary bg-primary/10 shadow-[0_0_10px_rgba(255,85,0,0.1)]"
                                : "border-border bg-card hover:bg-accent hover:border-primary/30"
                        )}
                    >
                        <div className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                        )}>
                            {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                        </div>
                        <span className={cn("text-sm", isSelected ? "text-primary-foreground" : "text-muted-foreground")}>
                            {option.text}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}
