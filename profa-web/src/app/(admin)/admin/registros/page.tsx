"use client"

import { useEffect, useState } from "react"
import { RegistrationManager } from "@/features/admin/components/RegistrationManager"
import { RefreshCw, UserPlus, Activity } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/shared/lib/supabase/client"

export default function AdminRegistrosPage() {
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        (async () => {
            const supabase = createClient()
            const { data } = await supabase.auth.getSession()
            setToken(data.session?.access_token || null)
        })()
    }, [])

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 text-[#FF3300] font-black text-[10px] uppercase tracking-[0.5em] mb-2">
                        <Activity size={14} className="animate-pulse" /> Registro de Nuevos Aspirantes
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight flex items-center gap-4">
                        Solicitudes de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3300] to-white">Acceso</span>
                    </h1>
                    <p className="text-gray-600 text-sm mt-2">Revisa, aprueba o rechaza solicitudes de nuevos aspirantes al PROFA.</p>
                </div>
                <div className="flex gap-4">
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF3300]/30 transition-all text-xs font-black uppercase tracking-widest text-gray-400"
                    >
                        Gestión Usuarios
                    </Link>
                    <Link
                        href={`${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('.supabase.co', '') || ''}/registro`}
                        target="_blank"
                        className="flex items-center gap-2 bg-[#FF3300] text-black font-black px-6 py-3 rounded-2xl hover:bg-white transition-all text-xs uppercase tracking-widest"
                    >
                        <UserPlus size={14} /> Ver Formulario Público
                    </Link>
                </div>
            </div>

            {/* Manager */}
            {token ? (
                <RegistrationManager
                    adminToken={token}
                    supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL || ""}
                />
            ) : (
                <div className="flex items-center justify-center py-20">
                    <RefreshCw className="w-8 h-8 text-[#FF3300] animate-spin" />
                </div>
            )}
        </div>
    )
}
