"use client"

import { useState, useEffect } from "react"
import { CyberCard } from "@/shared/ui/CyberCard"
import { Toggle } from "@/shared/ui/Toggle"
import { Check, X, User, Users } from "lucide-react"
import Link from "next/link"

interface PendingUser {
    id: string
    full_name: string
    dni: string
    email: string
    created_at: string
}

export function PendingUsersWidget() {
    const [users, setUsers] = useState<PendingUser[]>([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState<string | null>(null)
    const [fetchError, setFetchError] = useState<string | null>(null)

    const fetchPending = async () => {
        try {
            const res = await fetch('/api/admin/users')
            const json = await res.json()
            if (!res.ok) {
                setFetchError(json.error || `Error ${res.status}`)
                return
            }
            if (json.users) setUsers(json.users)
        } catch (e: any) {
            console.error("Error fetching pending users", e)
            setFetchError(e.message)
        } finally {
            setLoading(false)
        }
    }

    const activateUser = async (userId: string) => {
        if (processing) return
        setProcessing(userId)

        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, isActive: true }),
            })
            const json = await res.json()

            if (json.success) {
                setUsers(prev => prev.filter(u => u.id !== userId))
            } else {
                alert("❌ Error: " + (json.error || "No se pudo activar"))
            }
        } catch (e: any) {
            alert("Error: " + e.message)
        } finally {
            setProcessing(null)
        }
    }

    const deleteUser = async (userId: string) => {
        if (processing) return
        if (!confirm("⚠️ ¿BORRAR USUARIO?")) return

        setProcessing(userId)

        try {
            const res = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            })
            const json = await res.json()

            if (json.success) {
                setUsers(prev => prev.filter(u => u.id !== userId))
            } else {
                alert("❌ Error: " + (json.error || "No se pudo borrar"))
            }
        } catch (e: any) {
            alert("Error: " + e.message)
        } finally {
            setProcessing(null)
        }
    }

    useEffect(() => {
        fetchPending()
    }, [])

    if (loading) return <div className="p-4 text-center text-muted-foreground animate-pulse">Cargando solicitudes...</div>

    if (fetchError) {
        return (
            <CyberCard title="Solicitudes Pendientes" className="h-full border-red-500/30">
                <div className="flex flex-col items-center justify-center p-8 text-red-400 gap-2">
                    <X className="h-8 w-8" />
                    <p className="text-sm font-bold">Error al cargar usuarios</p>
                    <p className="text-xs text-red-400/70 text-center">{fetchError}</p>
                    <button
                        onClick={() => { setFetchError(null); setLoading(true); fetchPending() }}
                        className="mt-2 px-4 py-1 text-xs border border-red-500/30 rounded hover:bg-red-500/10"
                    >
                        Reintentar
                    </button>
                </div>
            </CyberCard>
        )
    }

    if (users.length === 0) {
        return (
            <CyberCard title="Solicitudes Pendientes" className="h-full">
                <div className="flex flex-col items-center justify-center p-8 text-muted-foreground gap-2">
                    <Check className="h-8 w-8 text-green-500/50" />
                    <p>No hay usuarios pendientes de activación.</p>
                </div>
            </CyberCard>
        )
    }

    return (
        <CyberCard
            title="Solicitudes de Acceso (Pendientes)"
            className="h-full border-orange-500/20"
            footer={
                <div className="w-full flex justify-center p-2 border-t border-border/10">
                    <Link
                        href="/admin/users"
                        className="text-[10px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 uppercase tracking-widest"
                    >
                        Gestionar todos los usuarios <Users className="h-3 w-3" />
                    </Link>
                </div>
            }
        >
            <div className="space-y-4">
                {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">{user.full_name || "Sin nombre"}</p>
                                <p className="text-xs text-muted-foreground font-mono">DNI: {user.dni || "N/A"}</p>
                                <p className="text-[10px] text-muted-foreground">{user.email?.replace('@lexnova.app', '')}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="grid grid-cols-2 gap-4 items-center">
                                {/* Delete */}
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[9px] font-bold text-red-500/70 uppercase">Borrar</span>
                                    <button
                                        onClick={() => deleteUser(user.id)}
                                        className={`p-2 rounded-lg border transition-all ${processing === user.id ? 'opacity-50 cursor-not-allowed' : 'text-red-500 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/50'}`}
                                        title="Eliminar usuario permanentemente"
                                        disabled={!!processing}
                                    >
                                        {processing === user.id ? <span className="h-4 w-4 block animate-spin border-2 border-red-500 border-t-transparent rounded-full" /> : <X className="h-4 w-4" />}
                                    </button>
                                </div>

                                {/* Activate */}
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[9px] font-bold text-green-500/70 uppercase">Activar</span>
                                    <div className={processing === user.id ? 'opacity-50 pointer-events-none' : ''}>
                                        <Toggle
                                            checked={false}
                                            onChange={(checked) => {
                                                if (checked) {
                                                    activateUser(user.id)
                                                }
                                            }}
                                            labels={{ on: "ON", off: "OFF" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </CyberCard>
    )
}
