"use client"

import { useEffect, useState } from "react"
import { adminService } from "@/features/admin/services/admin.service"
import { UserManager } from "@/features/admin/components/UserManager"
import { RefreshCw, LayoutDashboard, Users, Activity, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

    const loadData = async () => {
        setLoading(true);
        const { data, error } = await adminService.getUsers();
        if (!error && data) {
            setUsers(data);
            setStats({
                total: data.length,
                active: data.filter((u: any) => u.is_active).length,
                inactive: data.filter((u: any) => !u.is_active).length
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        const { error } = await adminService.toggleUserStatus(userId, !currentStatus);
        if (!error) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
            setStats(prev => ({
                ...prev,
                active: currentStatus ? prev.active - 1 : prev.active + 1,
                inactive: currentStatus ? prev.inactive + 1 : prev.inactive - 1
            }));
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("⚠️ ¿ESTÁS SEGURO DE ELIMINAR ESTE ASPIRANTE DEFINITIVAMENTE?")) return;
        const { error } = await adminService.deleteUser(userId);
        if (!error) {
            setUsers(prev => prev.filter(u => u.id !== userId));
            loadData(); // Re-fetch for accurate stats
        }
    };

    const handleResetPassword = async (userId: string) => {
        const newOtp = prompt("Ingrese el nuevo código OTP de 4 dígitos (Ej. 1234):", "0000");
        if (newOtp && newOtp.length === 4) {
            const result = await adminService.resetPassword(userId, newOtp);
            if (result.success) {
                alert("✅ Clave actualizada correctamente.");
            } else {
                alert("❌ Error: Funcionalidad de reset requiere API / Edge Function operativa.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 space-y-10">
            {/* Header Cyber */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 text-[#FF3300] font-black text-[10px] uppercase tracking-[0.5em] mb-2">
                        <Activity size={14} className="animate-pulse" /> Nodo de Administración Central
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight flex items-center gap-4">
                        Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3300] to-white">Aspirantes</span>
                    </h1>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={loadData}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF3300]/50 transition-all group"
                    >
                        <RefreshCw className={`w-6 h-6 text-gray-400 group-hover:text-[#FF3300] ${loading ? 'animate-spin' : 'transition-transform group-hover:rotate-180'}`} />
                    </button>
                    <Link href="/dashboard" className="flex items-center gap-3 bg-[#FF3300] text-black font-black px-6 py-4 rounded-2xl hover:bg-white transition-all text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,51,0,0.3)]">
                        <LayoutDashboard size={16} /> Panel Control
                    </Link>
                </div>
            </div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "Base Total", val: stats.total, icon: Users, color: "text-white" },
                    { label: "Sistemas Activos", val: stats.active, icon: ShieldCheck, color: "text-[#00FF66]" },
                    { label: "Acceso Bloqueado", val: stats.inactive, icon: ShieldCheck, color: "text-[#FF3300]" },
                ].map((s, i) => (
                    <div key={i} className="bg-black/40 border border-white/5 rounded-3xl p-6 flex items-center justify-between group hover:border-white/20 transition-all">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
                            <p className={`text-4xl font-black ${s.color}`}>{s.val}</p>
                        </div>
                        <s.icon size={32} className="text-gray-800 group-hover:text-white/20 transition-colors" />
                    </div>
                ))}
            </div>

            {/* Main Manager Component */}
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/5 rounded-[3rem]">
                    <RefreshCw className="w-10 h-10 text-[#FF3300] animate-spin" />
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Sincronizando con el Núcleo...</p>
                </div>
            ) : (
                <UserManager
                    users={users}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                    onResetPassword={handleResetPassword}
                />
            )}
        </div>
    );
}
