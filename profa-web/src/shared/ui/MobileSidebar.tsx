"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
import { useAuth } from "@/features/login/hooks/useAuth";
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
    const router = useRouter()
    const { logout, user } = useAuth()

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

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

            <NeonButton variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="text-white hover:text-primary transition-colors">
                <Menu className="h-6 w-6" />
            </NeonButton>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/90 backdrop-blur-md z-[100] transition-all duration-300 animate-in fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={cn(
                "fixed inset-y-0 left-0 w-[85%] max-w-[300px] bg-card border-r border-border z-[101] transform transition-transform duration-500 ease-out flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)]",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-20 items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-background to-card">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(255,85,0,0.3)]" />
                        <span className="text-sm font-bold tracking-tight text-foreground leading-tight">
                            Derecho Perú <br />
                            <span className="text-[10px] text-primary font-normal">PROFA SOFTWARE</span>
                        </span>
                    </div>
                    <NeonButton variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">
                        <X className="h-6 w-6" />
                    </NeonButton>
                </div>

                <div className="flex-1 overflow-y-auto py-8 px-4 space-y-3 custom-scrollbar">
                    <p className="px-4 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-4">Navegación Principal</p>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 rounded-xl px-4 py-4 text-sm font-bold transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-[inset_0_0_15px_rgba(255,85,0,0.05)] border border-primary/20"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-full shadow-[0_0_10px_#FF5500]" />
                                )}
                                <item.icon className={cn("h-5 w-5", isActive ? "text-primary animate-pulse" : "group-hover:text-primary transition-colors")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="border-t border-border/50 bg-background/50 p-6 space-y-6">
                    <div className="flex items-center gap-4 px-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-[#FF3300] border border-primary/30 flex items-center justify-center text-white font-black text-lg shadow-[0_0_15px_rgba(255,85,0,0.3)]">
                            {user?.full_name?.[0] || "U"}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-sm font-black text-foreground uppercase tracking-wider">{user?.full_name || "Usuario"}</span>
                            <span className="truncate text-[10px] text-muted-foreground font-medium">{user?.email}</span>
                        </div>
                    </div>

                    {user?.role === 'admin' && (
                        <Link
                            href="/dashboard"
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-black text-primary hover:bg-primary/10 transition-all border border-primary/30 shadow-[0_0_15px_rgba(255,85,0,0.1)] group"
                        >
                            <BrainCircuit className="h-5 w-5 animate-pulse group-hover:rotate-12 transition-transform" />
                            PANEL ADMINISTRACIÓN
                        </Link>
                    )}

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-4 text-sm font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all border border-transparent hover:border-destructive/20"
                    >
                        <LogOut className="h-5 w-5" />
                        Cerrar Sesión
                    </button>

                    <div className="px-2 pt-4 border-t border-border/30 text-[9px] text-muted-foreground/60 leading-tight italic">
                        <p className="font-black uppercase tracking-tighter not-italic text-[10px] mb-1">Creador del Sistema:</p>
                        <p>Mg. Sergio J. De la Cruz Zúñiga</p>
                        <p className="mt-1 opacity-70">Especialista en Derecho Penal y Procesal Penal e IA - Perito Informático</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
