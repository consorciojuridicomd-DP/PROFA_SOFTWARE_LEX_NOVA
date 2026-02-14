"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Users,
    Upload,
    Settings,
    LogOut,
    Layers
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { NeonButton } from "@/shared/ui/NeonButton";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Preguntas", href: "/admin/questions", icon: FileText },
    { label: "Categorías", href: "/admin/categories", icon: Layers },
    { label: "Plantillas", href: "/admin/templates", icon: BookOpen },
    { label: "Usuarios", href: "/admin/users", icon: Users },
    { label: "Importar PDF", href: "/admin/import", icon: Upload },
    { label: "Configuración", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-md h-screen fixed left-0 top-0 flex flex-col z-40">
            {/* Header */}
            <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_10px_rgba(255,85,0,0.3)]">
                        <div className="h-4 w-4 bg-primary rounded-full animate-pulse" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">LexNova</h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "text-primary bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(255,85,0,0.1)]"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                            {item.label}
                            {isActive && (
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_#ff5500]" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 space-y-4">
                <div className="bg-card/50 rounded-lg p-3 border border-border flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                        AD
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">Administrador</p>
                        <p className="text-xs text-muted-foreground truncate">admin@lexnova.pe</p>
                    </div>
                </div>

                <Link href="/app">
                    <NeonButton variant="outline" className="w-full justify-start gap-2 text-xs h-9">
                        <LogOut className="h-3 w-3" /> Volver a App Estudiante
                    </NeonButton>
                </Link>
            </div>
        </aside>
    );
}
