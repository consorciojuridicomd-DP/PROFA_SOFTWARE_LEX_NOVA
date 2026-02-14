"use client"

import { cn } from "@/shared/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const neonButtonVariants = cva(
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 tracking-wider uppercase overflow-hidden group active:scale-95 [&_svg]:drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground border border-primary/50 shadow-[0_0_15px_rgba(255,85,0,0.5)] hover:bg-primary hover:shadow-[0_0_30px_rgba(255,85,0,0.8)] hover:border-primary before:content-[''] before:absolute before:top-0 before:left-0 before:w-1/2 before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:animate-[shine_1s_ease-in-out_infinite]",
                outline:
                    "border border-primary bg-background/50 text-primary hover:bg-primary/10 hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(255,85,0,0.6)] hover:border-primary/80 before:content-[''] before:absolute before:top-0 before:left-0 before:w-1/2 before:h-full before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:-translate-x-full hover:before:animate-[shine_1s_ease-in-out_infinite]",
                ghost: "hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_10px_rgba(255,85,0,0.3)]",
                link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_20px_rgba(255,0,0,0.6)]",
            },
            size: {
                default: "h-10 px-6 py-2",
                sm: "h-9 rounded-md px-3 text-xs",
                lg: "h-12 rounded-md px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface NeonButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neonButtonVariants> {
    asChild?: boolean;
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(neonButtonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
NeonButton.displayName = "NeonButton";

export { NeonButton, neonButtonVariants };
