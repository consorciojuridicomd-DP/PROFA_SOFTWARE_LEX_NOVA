"use client"

import { useState } from "react"
import { CyberCard } from "@/shared/ui/CyberCard"
import {
    UserCheck,
    UserX,
    Trash2,
    ShieldAlert,
    Zap,
    Activity,
    Mail,
    Fingerprint,
    Calendar,
    Search,
    Settings,
    ShieldCheck,
    Cpu,
    Lock,
    Unlock,
    Flame
} from "lucide-react"

interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    dni: string | null;
    role: string;
    is_active: boolean;
    created_at: string;
}

interface UserManagerProps {
    users: UserProfile[];
    onToggleStatus: (userId: string, currentStatus: boolean) => void;
    onDelete: (userId: string) => void;
    onResetPassword: (userId: string) => void;
}

export function UserManager({ users, onToggleStatus, onDelete, onResetPassword }: UserManagerProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter(user =>
        (user.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.dni || "").includes(searchTerm)
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* HUB DE CONTROL SUPERIOR */}
            <div className="relative group/search">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FF3300] via-[#FF8800] to-[#FF3300] rounded-[2rem] blur opacity-20 group-focus-within/search:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center bg-[#0A0A0A]/80 border border-white/10 rounded-[2rem] px-8 py-5 backdrop-blur-2xl group-focus-within/search:border-[#FF3300]/50 transition-all">
                    <div className="flex items-center gap-4 mr-6">
                        <Settings className="text-[#FF3300] animate-[spin_4s_linear_infinite]" size={24} />
                        <div className="h-8 w-px bg-white/10"></div>
                    </div>
                    <Search className="text-gray-500 group-focus-within/search:text-[#FF3300] transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="IDENTIFICAR ASPIRANTE EN EL SISTEMA..."
                        className="w-full bg-transparent border-none focus:outline-none text-white font-black px-4 text-sm uppercase tracking-[0.2em] placeholder:text-gray-800"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-gradient-to-r from-[#FF3300]/20 to-transparent border border-[#FF3300]/30 text-[10px] font-black text-[#FF3300] uppercase tracking-widest shadow-[0_0_15px_rgba(255,51,0,0.1)]">
                        <Cpu size={12} className="animate-pulse" /> {filteredUsers.length} NODOS DETECTADOS
                    </div>
                </div>
            </div>

            {/* MATRIX DE ASPIRANTES (Tarjetas Espaciales) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        className="group/user relative overflow-hidden bg-gradient-to-br from-black/60 to-black/20 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] p-8 transition-all duration-700 hover:border-[#FF3300]/50 hover:shadow-[0_0_80px_-20px_rgba(255,51,0,0.4)] hover:-translate-y-2"
                    >
                        {/* Background Scanning Animation */}
                        <div className="absolute inset-0 opacity-0 group-hover/user:opacity-10 pointer-events-none transition-opacity duration-700 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF3300] animate-scanner-line"></div>
                            <div className="absolute inset-0 bg-[url('/circuits.svg')] bg-cover scale-150 rotate-12"></div>
                        </div>

                        {/* Status Ambient Glow */}
                        <div className={`absolute -top-20 -right-20 w-64 h-64 blur-[100px] opacity-10 transition-all duration-1000 group-hover/user:opacity-30 ${user.is_active ? 'bg-[#00FF66]' : 'bg-[#FF3300]'}`}></div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-8">
                            {/* Avatar & Power State */}
                            <div className="flex flex-col items-center gap-6">
                                <div className={`relative w-28 h-28 rounded-3xl flex items-center justify-center border-2 overflow-hidden transition-all duration-700 group-hover/user:scale-110 ${user.is_active ? 'border-[#00FF66]/50 bg-[#00FF66]/5 shadow-[0_0_30px_rgba(0,255,102,0.2)]' : 'border-[#FF3300]/50 bg-[#FF3300]/5 shadow-[0_0_30px_rgba(255,51,0,0.2)]'}`}>
                                    {/* Glass Shine */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
                                    <span className={`text-4xl font-black relative z-10 drop-shadow-lg ${user.is_active ? 'text-[#00FF66]' : 'text-[#FF3300]'}`}>
                                        {(user.full_name || user.email)?.[0]?.toUpperCase()}
                                    </span>
                                    {/* Rotating Gear behind avatar */}
                                    <Settings className={`absolute -bottom-4 -right-4 w-12 h-12 opacity-10 ${user.is_active ? 'text-[#00FF66] animate-[spin_10s_linear_infinite]' : 'text-[#FF3300] animate-[spin_5s_linear_infinite_reverse]'}`} />
                                </div>

                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 text-[9px] font-black uppercase tracking-[0.3em] shadow-lg ${user.is_active ? 'border-[#00FF66]/20 bg-[#00FF66]/10 text-[#00FF66] animate-pulse' : 'border-[#FF3300]/20 bg-[#FF3300]/10 text-[#FF3300]'}`}>
                                    {user.is_active ? <Unlock size={10} /> : <Lock size={10} />}
                                    {user.is_active ? 'SISTEMA ONLINE' : 'SISTEMA OFFLINE'}
                                </div>
                            </div>

                            {/* Core Data Section */}
                            <div className="flex-1 space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-2 w-2 rounded-full bg-[#FF3300]"></div>
                                        <span className="text-gray-500 font-black text-[8px] uppercase tracking-[0.5em]">Identidad Digital</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover/user:text-transparent group-hover/user:bg-clip-text group-hover/user:bg-gradient-to-r group-hover/user:from-[#FF3300] group-hover/user:to-white transition-all duration-500">
                                        {user.full_name || "Aspirante No Identificado"}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-4">
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase group-hover/user:text-white transition-colors">
                                            <Fingerprint size={14} className="text-[#FF3300]" />
                                            <span className="tracking-widest">{user.dni || "NO DATA"}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase group-hover/user:text-white transition-colors">
                                            <Mail size={14} className="text-[#FF3300]" />
                                            <span className="truncate max-w-[150px]">{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400/50 uppercase">
                                            <Calendar size={14} className="text-gray-700" />
                                            <span>ALTA: {new Date(user.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* CONFIGURATION ZONE (Engranajes y Botones Neón) */}
                                <div className="flex flex-wrap gap-4 pt-4 border-t border-white/[0.05] relative">
                                    {/* Action Gear Icon Decorative */}
                                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover/user:opacity-10 transition-opacity">
                                        <Settings size={100} className="animate-[spin_20s_linear_infinite]" />
                                    </div>

                                    {/* NEON TOGGLE STATUS */}
                                    <button
                                        onClick={() => onToggleStatus(user.id, user.is_active)}
                                        className={`relative overflow-hidden px-6 py-2.5 rounded-2xl border-2 font-black text-[9px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-3 shadow-lg active:scale-90 ${user.is_active ? 'border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]' : 'border-green-600/30 text-green-500 hover:bg-green-600 hover:text-white hover:shadow-[0_0_30px_rgba(22,163,74,0.4)]'}`}
                                    >
                                        <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                                        {user.is_active ? <Lock size={14} /> : <Unlock size={14} />}
                                        {user.is_active ? 'Inhabilitar Nodo' : 'Activar Nodo'}
                                    </button>

                                    {/* ZAP RESET (Rayo) */}
                                    <button
                                        onClick={() => onResetPassword(user.id)}
                                        className="relative overflow-hidden px-6 py-2.5 rounded-2xl border-2 border-yellow-500/30 text-yellow-500 font-black text-[9px] uppercase tracking-[0.2em] transition-all duration-500 hover:bg-yellow-500 hover:text-black flex items-center gap-3 shadow-lg hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] active:scale-90"
                                    >
                                        <Zap size={14} className="group-hover/user:animate-bounce" /> REINICIO ZAP
                                    </button>

                                    {/* DESTRUCTION OF RECORD (Fuego/Papelera) */}
                                    <button
                                        onClick={() => onDelete(user.id)}
                                        className="relative overflow-hidden px-6 py-2.5 rounded-2xl border-2 border-gray-800 text-gray-700 font-black text-[9px] uppercase tracking-[0.2em] transition-all duration-500 hover:border-red-600 hover:text-red-600 hover:bg-red-600/10 flex items-center gap-3 group/delete"
                                    >
                                        <Flame size={14} className="group-hover/delete:animate-pulse" /> DESTRUIR RÉCORD
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Lateral Tech Bar Decoration */}
                        <div className={`absolute top-0 left-0 w-1.5 h-full transition-all duration-700 ${user.is_active ? 'bg-[#00FF66] shadow-[0_0_15px_#00FF66]' : 'bg-[#FF3300] shadow-[0_0_15px_#FF3300]'}`}></div>
                    </div>
                ))}
            </div>

            {/* ERROR STATE / EMPTY NODES */}
            {filteredUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center p-32 border-2 border-dashed border-white/5 rounded-[4rem] bg-white/[0.01] overflow-hidden relative">
                    <div className="absolute inset-0 opacity-[0.02] bg-[url('/circuits.svg')] bg-center"></div>
                    <ShieldAlert size={64} className="text-gray-900 mb-6 animate-pulse" />
                    <h4 className="text-gray-700 font-black text-xl uppercase tracking-[0.5em] text-center max-w-md">
                        Sonda de Búsqueda Sin Resultados en el Sector
                    </h4>
                </div>
            )}
        </div>
    )
}
