/**
 * RegistrationManager - Panel admin para gestionar solicitudes de nuevos aspirantes
 * Muestra solicitudes pendientes, permite aprobar/rechazar y crea cuentas via Edge Function
 */
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/shared/lib/supabase/client"
import {
    CheckCircle, XCircle, Clock, User, Mail, CreditCard,
    Phone, BookOpen, MessageSquare, Loader2, RefreshCw,
    ChevronDown, ChevronUp, Shield, AlertTriangle
} from "lucide-react"

interface RegistrationRequest {
    id: string
    full_name: string
    email: string
    dni: string
    phone: string | null
    especialidad: string | null
    mensaje: string | null
    status: "pending" | "approved" | "rejected"
    created_at: string
    reviewed_at: string | null
}

interface Props {
    adminToken: string
    supabaseUrl: string
}

const STATUS_CONFIG = {
    pending: { label: "Pendiente", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", icon: Clock },
    approved: { label: "Aprobado", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20", icon: CheckCircle },
    rejected: { label: "Rechazado", color: "text-red-500", bg: "bg-red-500/10 border-red-500/20", icon: XCircle },
}

export function RegistrationManager({ adminToken, supabaseUrl }: Props) {
    const [requests, setRequests] = useState<RegistrationRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState<string | null>(null)
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [feedback, setFeedback] = useState<{ id: string, message: string, type: "ok" | "err" } | null>(null)

    const supabase = createClient()

    const loadRequests = async () => {
        setLoading(true)
        let query = supabase
            .from("registration_requests")
            .select("*")
            .order("created_at", { ascending: false })

        if (filter !== "all") query = query.eq("status", filter)

        const { data, error } = await query
        if (!error && data) setRequests(data as RegistrationRequest[])
        setLoading(false)
    }

    useEffect(() => { loadRequests() }, [filter])

    const handleApprove = async (req: RegistrationRequest) => {
        if (!confirm(`¿Aprobar y crear cuenta para ${req.full_name}?\n\nClave inicial = DNI del aspirante.`)) return
        setActionLoading(req.id)
        setFeedback(null)

        try {
            const res = await fetch(`${supabaseUrl}/functions/v1/approve-student-registration`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminToken}`
                },
                body: JSON.stringify({
                    request_id: req.id,
                    initial_password: req.dni
                })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Error al aprobar")

            setFeedback({ id: req.id, message: `✅ Cuenta creada. Clave inicial: ${req.dni}`, type: "ok" })
            setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "approved" } : r))
        } catch (err: any) {
            setFeedback({ id: req.id, message: `❌ ${err.message}`, type: "err" })
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async (req: RegistrationRequest) => {
        const reason = prompt("Motivo del rechazo (opcional):")
        if (reason === null) return // Cancelado

        setActionLoading(req.id)
        setFeedback(null)

        try {
            const { error } = await supabase.rpc("reject_registration", {
                p_request_id: req.id,
                p_reason: reason || ""
            })
            if (error) throw new Error(error.message)

            setFeedback({ id: req.id, message: "Solicitud rechazada.", type: "ok" })
            setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "rejected" } : r))
        } catch (err: any) {
            setFeedback({ id: req.id, message: `❌ ${err.message}`, type: "err" })
        } finally {
            setActionLoading(null)
        }
    }

    const counts = {
        all: requests.length,
        pending: requests.filter(r => r.status === "pending").length,
        approved: requests.filter(r => r.status === "approved").length,
        rejected: requests.filter(r => r.status === "rejected").length,
    }

    const FILTERS: Array<{ key: typeof filter; label: string }> = [
        { key: "pending", label: "Pendientes" },
        { key: "approved", label: "Aprobados" },
        { key: "rejected", label: "Rechazados" },
        { key: "all", label: "Todos" },
    ]

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="flex flex-wrap gap-3">
                {FILTERS.map(f => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest border transition-all ${filter === f.key
                                ? "bg-[#FF3300] text-black border-[#FF3300] shadow-[0_0_20px_rgba(255,51,0,0.3)]"
                                : "bg-white/5 text-gray-400 border-white/10 hover:border-[#FF3300]/30"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
                <button
                    onClick={loadRequests}
                    className="ml-auto p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF3300]/30 transition-all"
                >
                    <RefreshCw size={14} className={`text-gray-400 ${loading ? "animate-spin" : ""}`} />
                </button>
            </div>

            {/* Lista */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#FF3300] animate-spin" />
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-20 text-gray-700 border-2 border-dashed border-white/5 rounded-3xl">
                    <Shield size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-black uppercase tracking-widest text-sm">No hay solicitudes {filter !== "all" ? filter : ""}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map(req => {
                        const cfg = STATUS_CONFIG[req.status]
                        const StatusIcon = cfg.icon
                        const isExpanded = expanded === req.id
                        const isActioning = actionLoading === req.id
                        const fb = feedback?.id === req.id ? feedback : null

                        return (
                            <div
                                key={req.id}
                                className="bg-black/40 border border-white/[0.06] rounded-2xl overflow-hidden transition-all hover:border-white/10"
                            >
                                {/* Header clickable */}
                                <button
                                    onClick={() => setExpanded(isExpanded ? null : req.id)}
                                    className="w-full flex items-center gap-4 p-5 text-left"
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-xl bg-[#FF3300]/10 border border-[#FF3300]/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-[#FF3300] font-black text-sm">
                                            {req.full_name[0]?.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Info principal */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="font-black text-white text-sm truncate">{req.full_name}</span>
                                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${cfg.bg} ${cfg.color}`}>
                                                <StatusIcon size={10} /> {cfg.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-[11px] text-gray-600 flex-wrap">
                                            <span className="flex items-center gap-1"><Mail size={10} /> {req.email}</span>
                                            <span className="flex items-center gap-1"><CreditCard size={10} /> DNI: {req.dni}</span>
                                            <span>{new Date(req.created_at).toLocaleDateString("es-PE")}</span>
                                        </div>
                                    </div>

                                    {isExpanded ? <ChevronUp size={16} className="text-gray-600 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-600 flex-shrink-0" />}
                                </button>

                                {/* Detalle expandido */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 border-t border-white/[0.05] space-y-4 pt-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { icon: User, label: "Nombre", val: req.full_name },
                                                { icon: Mail, label: "Correo", val: req.email },
                                                { icon: CreditCard, label: "DNI", val: req.dni },
                                                { icon: Phone, label: "Teléfono", val: req.phone || "—" },
                                                { icon: BookOpen, label: "Especialidad", val: req.especialidad || "General" },
                                            ].map(({ icon: Icon, label, val }) => (
                                                <div key={label}>
                                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1 mb-1">
                                                        <Icon size={9} /> {label}
                                                    </p>
                                                    <p className="text-white text-xs font-bold truncate">{val}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {req.mensaje && (
                                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1 mb-2">
                                                    <MessageSquare size={9} /> Mensaje del aspirante
                                                </p>
                                                <p className="text-gray-400 text-xs leading-relaxed">{req.mensaje}</p>
                                            </div>
                                        )}

                                        {fb && (
                                            <div className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold ${fb.type === "ok"
                                                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                                                    : "bg-red-500/10 border-red-500/20 text-red-400"
                                                }`}>
                                                {fb.type === "ok" ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                                {fb.message}
                                            </div>
                                        )}

                                        {/* Acciones — solo para pendientes */}
                                        {req.status === "pending" && (
                                            <div className="flex gap-3 flex-wrap">
                                                <button
                                                    onClick={() => handleApprove(req)}
                                                    disabled={isActioning}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 text-black font-black text-[11px] uppercase tracking-widest hover:bg-green-400 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,102,0.2)]"
                                                >
                                                    {isActioning ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                                    Aprobar y Crear Cuenta
                                                </button>
                                                <button
                                                    onClick={() => handleReject(req)}
                                                    disabled={isActioning}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/30 text-red-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-500/10 transition-all disabled:opacity-50"
                                                >
                                                    {isActioning ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                                                    Rechazar
                                                </button>
                                            </div>
                                        )}

                                        {req.status !== "pending" && (
                                            <p className="text-[10px] text-gray-700 italic">
                                                Revisado el {req.reviewed_at ? new Date(req.reviewed_at).toLocaleDateString("es-PE") : "—"}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
