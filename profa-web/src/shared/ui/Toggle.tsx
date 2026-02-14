"use client"

import { cn } from "@/shared/lib/utils"

interface ToggleProps {
    checked: boolean
    onChange: (checked: boolean) => void
    disabled?: boolean
    className?: string
    labels?: { on: string; off: string }
}

export function Toggle({ checked, onChange, disabled = false, className, labels = { on: "ON", off: "OFF" } }: ToggleProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
            className={cn(
                "group relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                checked ? "bg-green-500" : "bg-zinc-600",
                className
            )}
        >
            <span className="sr-only">Use setting</span>
            <span
                className={cn(
                    "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
                    checked ? "translate-x-7" : "translate-x-0"
                )}
            />

            {/* Minimal labels outside or subtle inside? User asked for "ON/OFF" models. 
                Let's put small text inside if space permits, or just rely on color. 
                The "Capsule" usually implies color coding. 
                I'll add the labels conditionally if they fit, but make them very subtle. 
            */}
            <span className={cn(
                "absolute left-1.5 text-[9px] font-bold text-white transition-opacity",
                checked ? "opacity-100" : "opacity-0"
            )}>
                {labels.on}
            </span>
            <span className={cn(
                "absolute right-1.5 text-[9px] font-bold text-white transition-opacity",
                !checked ? "opacity-100" : "opacity-0"
            )}>
                {labels.off}
            </span>
        </button>
    )
}
