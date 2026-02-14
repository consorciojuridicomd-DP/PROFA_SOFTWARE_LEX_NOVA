"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import {
    LayoutDashboard,
    BookOpen,
    BarChart2,
    History,
    User,
    LogOut,
    BrainCircuit,
    FileText,
    Settings
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const navItems = [
    { name: "Dashboard", href: "/app", icon: LayoutDashboard },
    { name: "Nuevo Examen", href: "/app/select", icon: BookOpen },
    { name: "Resultados", href: "/app/results", icon: BarChart2 },
    { name: "Plan de Estudio", href: "/app/study-plan", icon: BrainCircuit },
    { name: "Extractor PDF", href: "/app/pdf-tools", icon: FileText },
    { name: "Historial", href: "/app/history", icon: History },
    { name: "Perfil", href: "/app/profile", icon: User },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    return (
        <div className="flex h-screen w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl">
            <div className="flex h-16 items-center border-b border-border px-6 gap-3">
                <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                <span className="text-sm font-bold tracking-tight text-foreground leading-tight">
                    Derecho Perú <br />
                    <span className="text-xs text-primary font-normal">PROFA SOFTWARE LexNova</span>
                </span>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary/10 text-primary shadow-[0_0_10px_rgba(255,85,0,0.2)]"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_8px_#FF5500]" />
                            )}
                            <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
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
                        <span className="truncate text-xs text-muted-foreground">{user?.email || "student@profa.com"}</span>
                    </div>
                </div>
                {user?.role === 'admin' && (
                    <Link
                        href="/dashboard"
                        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors mb-2 border border-primary/20 rounded-lg shadow-[0_0_8px_rgba(255,85,0,0.15)]"
                    >
                        <Settings className="h-4 w-4 animate-[spin_8s_linear_infinite]" />
                        Panel Admin
                    </Link>
                )}
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                </button>
            </div>

            <div className="px-6 pb-4 text-[10px] text-muted-foreground/60 leading-tight">
                <p className="font-semibold">Creador del Sistema:</p>
                <p>Mg. Sergio J. De la Cruz Zúñiga</p>
                <p className="mt-1">Especialista en Derecho Penal y Procesal Penal e IA - Perito Informático</p>
            </div>
        </div>
    );
}
