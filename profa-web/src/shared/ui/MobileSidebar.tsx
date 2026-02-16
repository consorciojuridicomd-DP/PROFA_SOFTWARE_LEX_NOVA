"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/shared/lib/utils"
import {
    LayoutDashboard,
    BookOpen,
    BarChart2,
    History,
    User,
    LogOut,
    Menu,
    X,
    BrainCircuit,
    FileText
} from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { NeonButton } from "@/shared/ui/NeonButton"

const navItems = [
    { name: "Dashboard", href: "/app", icon: LayoutDashboard },
    { name: "Nuevo Examen", href: "/app/select", icon: BookOpen },
    { name: "Resultados", href: "/app/results", icon: BarChart2 },
    { name: "Plan de Estudio", href: "/app/study-plan", icon: BrainCircuit },
    { name: "Extractor PDF", href: "/app/pdf-tools", icon: FileText },
    { name: "Historial", href: "/app/history", icon: History },
    { name: "Perfil", href: "/app/profile", icon: User },
];

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const { logout, user } = useAuth()

    // Close sidebar when route changes
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [isOpen])

    return (
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                <span className="text-sm font-bold tracking-tight text-foreground leading-tight">
                    Derecho Perú <br />
                    <span className="text-[10px] text-primary font-normal">PROFA SOFTWARE</span>
                </span>
            </div>

            <NeonButton variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                <Menu className="h-6 w-6" />
            </NeonButton>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={cn(
                "fixed inset-y-0 left-0 w-[280px] bg-card border-r border-border z-50 transform transition-transform duration-300 flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <span className="font-bold text-lg">Menú</span>
                    <NeonButton variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                        <X className="h-5 w-5" />
                    </NeonButton>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 rounded-lg px-4 py-4 text-sm font-semibold transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary/20 text-primary shadow-[inset_0_0_10px_rgba(255,85,0,0.1)]"
                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                )}
                                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="border-t border-border p-4">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold">
                            {user?.full_name?.[0] || "U"}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-sm font-medium text-foreground">{user?.full_name || "Usuario"}</span>
                            <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    )
}
