import { cn } from "@/shared/lib/utils";
import { ReactNode } from "react";

interface CyberCardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    icon?: ReactNode;
    hoverEffect?: boolean;
    footer?: ReactNode;
}

export function CyberCard({
    children,
    className,
    title,
    icon,
    hoverEffect = true,
    footer
}: CyberCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-primary/20 bg-card/50 backdrop-blur-md p-6 shadow-lg transition-all duration-300 flex flex-col",
                hoverEffect && "hover:border-primary/50 hover:shadow-[0_0_15px_rgba(255,85,0,0.15)] hover:-translate-y-1",
                className
            )}
        >
            {/* Scanline effect overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,11,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 opacity-20 bg-[length:100%_2px,3px_100%] pointer-events-none" />

            {/* Header if title/icon provided */}
            {(title || icon) && (
                <div className="relative z-10 mb-4 flex items-center gap-3 border-b border-primary/10 pb-3">
                    {icon && <div className="text-primary">{icon}</div>}
                    {title && <h3 className="text-lg font-semibold tracking-wide text-primary-foreground">{title}</h3>}
                </div>
            )}

            <div className="relative z-10 flex-1 h-full">
                {children}
            </div>

            {footer && (
                <div className="relative z-10 mt-4 pt-4 border-t border-primary/10">
                    {footer}
                </div>
            )}

            {/* Corner accents */}
            <div className="absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-primary/30 rounded-tl-xl" />
            <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-primary/30 rounded-br-xl" />
        </div>
    );
}
