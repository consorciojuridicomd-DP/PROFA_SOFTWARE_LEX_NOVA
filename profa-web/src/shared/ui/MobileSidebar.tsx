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
import { useAuth } from "@/features/login/hooks/useAuth"

const navItems = [
    { name: "Dashboard", href: "/app", icon: LayoutDashboard },
    { name: "Nuevo Examen", href: "/app/select", icon: BookOpen },
    { name: "Resultados", href: "/app/results", icon: BarChart2 },
    { name: "Plan de Estudio", href: "/app/study-plan", icon: BrainCircuit },
    { name: "Extractor PDF", href: "/app/pdf-tools", icon: FileText },
    { name: "Historial", href: "/app/history", icon: History },
    { name: "Perfil", href: "/app/profile", icon: User },
]

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const { logout } = useAuth()

    const handleLogout = async () => {
        await logout()
        router.push("/login")
    }

    // Cerrar sidebar al cambiar de ruta
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    // Bloquear scroll del body cuando está abierto
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
        <div className="md:hidden">
            {/* ── TOPBAR FIJA (Z-INDEX 80) ── */}
            <div className="fixed top-0 left-0 right-0 h-[56px] bg-black/80 backdrop-blur-[10px] border-b border-[#FF6A00]/20 z-[80] flex items-center px-4">
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-[36px] h-[36px] flex items-center justify-center text-white"
                    aria-label="Menú"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex flex-col ml-4 overflow-hidden">
                    <span className="text-[16px] font-semibold text-white truncate">Menú</span>
                    <span className="text-[12px] text-white/60 truncate italic">PROFA Software Lex Nova</span>
                </div>
                {/* Slot derecho: espacio para avatar si se requiere en el futuro */}
                <div className="ml-auto w-[36px] h-[36px]" />
            </div>

            {/* ── OVERLAY (Z-INDEX 90) ── */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/55 z-[90] transition-opacity duration-300 animate-in fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* ── DRAWER (Z-INDEX 100) ── */}
            <div className={cn(
                "fixed inset-y-0 left-0 w-[280px] bg-[#000000]/92 backdrop-blur-[10px] border-r border-[#FF6A00]/20 z-[100] transform transition-transform duration-200 ease-out flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Drawer Header (72px) */}
                <div className="h-[72px] flex items-center px-4 relative">
                    <span className="text-[18px] font-bold text-white uppercase tracking-wider">Menú</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-[36px] h-[36px] flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Menu Items Container (calc(100vh - 168px)) */}
                <div className="flex-1 overflow-y-auto pt-[12px] pb-[12px] px-4 space-y-2 custom-scrollbar" style={{ height: "calc(100vh - 168px)" }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex h-[48px] items-center gap-3 rounded-[12px] px-3 font-semibold text-[14px] transition-all duration-200 border",
                                    isActive
                                        ? "bg-[#FF6A00]/10 text-white border-[#FF6A00]/40 shadow-[0_0_15px_rgba(255,106,0,0.1)]Small"
                                        : "bg-black/40 text-white/60 border-[#FF6A00]/15 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-[#FF6A00]" : "text-white/40")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Drawer Footer (96px) */}
                <div className="h-[96px] border-t border-[#FF6A00]/15 bg-black/40 px-4 flex flex-col justify-center">
                    <button
                        onClick={handleLogout}
                        className="w-[248px] h-[44px] bg-[#FF6A00] hover:bg-[#FF8533] text-black font-bold rounded-[14px] flex items-center justify-center gap-2 transition-colors text-[15px]"
                    >
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </button>
                    <div className="mt-2 text-[11px] text-white/50 text-center uppercase tracking-widest font-medium">
                        Sesión activa — Alumno
                    </div>
                </div>
            </div>
        </div>
    )
}
