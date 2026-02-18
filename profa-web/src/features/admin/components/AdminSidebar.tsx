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
    Layers,
    Activity,
    Cpu,
    ShieldAlert
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { NeonButton } from "@/shared/ui/NeonButton";

const navItems = [
    { label: "SISTEMA DASHBOARD", href: "/dashboard", icon: LayoutDashboard },
    { label: "CONTROL PREGUNTAS", href: "/admin/questions", icon: FileText },
    { label: "MATRIZ CATEGORÍAS", href: "/admin/categories", icon: Layers },
    { label: "PLANTILLAS EXAMEN", href: "/admin/templates", icon: BookOpen },
    { label: "GESTIÓN ASPIRANTES", href: "/admin/users", icon: Settings }, // GEAR ICON FOR USERS AS REQUESTED
    { label: "INGESTA PDF (AI)", href: "/admin/import", icon: Upload },
    { label: "CONFIGURACIÓN", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-72 border-r border-[#FF3300]/20 bg-[#0A0A0A]/95 backdrop-blur-3xl h-screen fixed left-0 top-0 flex flex-col z-40 shadow-[20px_0_50px_-30px_rgba(255,51,0,0.1)]">
            {/* Header Cyber */}
            <div className="p-8 border-b border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF3300]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF3300] to-[#990000] p-[2px] shadow-[0_0_15px_rgba(255,51,0,0.3)]">
                        <div className="w-full h-full bg-black rounded-[0.9rem] flex items-center justify-center">
                            <Activity className="text-white animate-pulse" size={20} />
                        </div>
                    </div>
                    <div>
                        <h1 className="font-black text-xl tracking-tighter text-white">LEX<span className="text-[#FF3300]">NOVA</span></h1>
                        <p className="text-[9px] text-[#FF3300] font-black uppercase tracking-[0.4em] animate-glow">Master Admin</p>
                    </div>
                </div>
            </div>

            {/* Nav con estética Cyber-Link */}
            <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="text-[8px] font-black text-gray-700 uppercase tracking-[0.5em] mb-4 px-4">Modulos de Control</div>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "text-white bg-[#FF3300]/10 border border-[#FF3300]/30 shadow-[0_0_20px_rgba(255,51,0,0.1)] shadow-inner"
                                    : "text-gray-500 hover:text-white hover:bg-white/[0.03] border border-transparent"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 transition-transform duration-500 group-hover:rotate-12", isActive ? "text-[#FF3300] drop-shadow-[0_0_8px_#FF3300]" : "text-gray-700")} />
                            {item.label}
                            {isActive && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#FF3300] rounded-l-full shadow-[0_0_15px_#FF3300]" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF3300]/10 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 pointer-events-none"></div>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Admin Tech */}
            <div className="p-6 border-t border-white/5 space-y-4">
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-t from-gray-900 to-gray-800 border border-white/10 flex items-center justify-center font-black text-[#FF3300] shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#FF3300]/5 animate-pulse"></div>
                        ADM
                    </div>
                    <div className="overflow-hidden flex-1">
                        <p className="text-[10px] font-black text-white truncate uppercase tracking-widest">Capítulo Central</p>
                        <p className="text-[8px] text-gray-600 truncate font-mono tracking-tighter uppercase">status: encrypted</p>
                    </div>
                    <Settings size={14} className="text-gray-800 animate-[spin_10s_linear_infinite]" />
                </div>

                <Link href="/app">
                    <button className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:border-[#FF3300] text-gray-500 hover:text-white px-4 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 group">
                        <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Retorno Sistema Estudiante
                    </button>
                </Link>
            </div>
        </aside>
    );
}
