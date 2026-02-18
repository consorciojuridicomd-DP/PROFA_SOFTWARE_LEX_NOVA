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
        <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {options.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                return (
                    <button
                        key={option.id}
                        onClick={() => onSelect(option.id)}
                        className={cn(
                            "w-full text-left p-3 sm:p-4 rounded-lg border transition-all duration-300 flex items-start gap-3 group active:scale-[0.98]",
                            isSelected
                                ? "border-primary bg-primary/20 shadow-[0_0_15px_rgba(255,85,0,0.15)] ring-1 ring-primary"
                                : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/40"
                        )}
                    >
                        <div className={cn(
                            "mt-0.5 flex h-4 sm:h-5 w-4 sm:w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                            isSelected
                                ? "border-primary bg-primary shadow-[0_0_8px_rgba(255,85,0,0.5)]"
                                : "border-white/30 group-hover:border-primary/60"
                        )}>
                            {isSelected && <div className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-white animate-in zoom-in-50 duration-300" />}
                        </div>
                        <span className={cn(
                            "text-xs sm:text-sm leading-snug flex-1",
                            isSelected ? "text-white font-medium shadow-primary/20" : "text-gray-400 group-hover:text-gray-200"
                        )}>
                            {option.text}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}
