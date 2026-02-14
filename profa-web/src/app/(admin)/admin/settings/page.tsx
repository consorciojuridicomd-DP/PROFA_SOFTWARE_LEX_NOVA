"use client"

import { useEffect, useState } from "react"
import { CyberCard } from "@/shared/ui/CyberCard"
import { NeonButton } from "@/shared/ui/NeonButton"
import { Toggle } from "@/shared/ui/Toggle"
import { Save, AlertTriangle, ShieldCheck, Mail, Phone, Globe } from "lucide-react"
import { SettingsService } from "@/features/admin/services/settings.service"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

interface SystemSettings {
    allow_registration: boolean
    maintenance_mode: boolean
    support_contact: {
        email: string
        phone: string
        website: string
    }
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SystemSettings>({
        allow_registration: true,
        maintenance_mode: false,
        support_contact: { email: "", phone: "", website: "" }
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        setLoading(true)
        const all = await SettingsService.getAll()

        // Merge with defaults/types
        setSettings({
            allow_registration: all.allow_registration ?? true,
            maintenance_mode: all.maintenance_mode ?? false,
            support_contact: {
                email: all.support_contact?.email || "",
                phone: all.support_contact?.phone || "",
                website: all.support_contact?.website || ""
            }
        })
        setLoading(false)
    }

    const handleSave = async () => {
        setSaving(true)
        await Promise.all([
            SettingsService.set('allow_registration', settings.allow_registration),
            SettingsService.set('maintenance_mode', settings.maintenance_mode),
            SettingsService.set('support_contact', settings.support_contact)
        ])
        setSaving(false)
        // Ideally show toast here
    }

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Sala de Máquinas (Configuración)</h2>
                <p className="text-muted-foreground">Controla los parámetros vitales del sistema LexNova.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* SYSTEM CONTROLS */}
                <CyberCard title="Control de Acceso" className="border-primary/20 h-full">
                    <div className="space-y-6">
                        {/* Registration Toggle */}
                        <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg border border-border">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className={`h-6 w-6 ${settings.allow_registration ? 'text-green-500' : 'text-muted-foreground'}`} />
                                <div>
                                    <p className="font-bold">Registro de Usuarios</p>
                                    <p className="text-xs text-muted-foreground">
                                        {settings.allow_registration
                                            ? "Nuevos usuarios pueden registrarse."
                                            : "El registro público está CERRADO."}
                                    </p>
                                </div>
                            </div>
                            <Toggle
                                checked={settings.allow_registration}
                                onChange={(val) => setSettings(prev => ({ ...prev, allow_registration: val }))}
                                labels={{ on: "ABIERTO", off: "CERRADO" }}
                            />
                        </div>

                        {/* Maintenance Toggle */}
                        <div className={`p-4 rounded-lg border transition-colors ${settings.maintenance_mode ? 'bg-orange-500/10 border-orange-500/30' : 'bg-muted/10 border-border'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className={`h-6 w-6 ${settings.maintenance_mode ? 'text-orange-500' : 'text-muted-foreground'}`} />
                                    <div>
                                        <h4 className={`font-bold ${settings.maintenance_mode ? 'text-orange-500' : ''}`}>Modo Mantenimiento</h4>
                                    </div>
                                </div>
                                <Toggle
                                    checked={settings.maintenance_mode}
                                    onChange={(val) => setSettings(prev => ({ ...prev, maintenance_mode: val }))}
                                    className={settings.maintenance_mode ? "bg-orange-600" : ""}
                                    labels={{ on: "ACTIVO", off: "INACTIVO" }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground ml-9">
                                Si activas esto, <strong>nadie podrá iniciar sesión</strong> excepto administradores. Úsalo con precaución.
                            </p>
                        </div>
                    </div>
                </CyberCard>

                {/* CONTACT INFO */}
                <CyberCard title="Información de Soporte" className="h-full">
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            Estos datos aparecerán en el footer y en la pantalla de ayuda para los estudiantes.
                        </p>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email de Soporte</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    placeholder="hola@lexnova.app"
                                    className="pl-9"
                                    value={settings.support_contact.email}
                                    onChange={e => setSettings(prev => ({
                                        ...prev,
                                        support_contact: { ...prev.support_contact, email: e.target.value }
                                    }))}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    placeholder="+51 999 999 999"
                                    className="pl-9"
                                    value={settings.support_contact.phone}
                                    onChange={e => setSettings(prev => ({
                                        ...prev,
                                        support_contact: { ...prev.support_contact, phone: e.target.value }
                                    }))}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="website">Website / Recursos</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="website"
                                    placeholder="https://recursos.lexnova.app"
                                    className="pl-9"
                                    value={settings.support_contact.website}
                                    onChange={e => setSettings(prev => ({
                                        ...prev,
                                        support_contact: { ...prev.support_contact, website: e.target.value }
                                    }))}
                                />
                            </div>
                        </div>
                    </div>
                </CyberCard>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                <CyberCard title="Sistema">
                    <div className="space-y-4 text-sm text-muted-foreground">
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span>Versión del Software</span>
                            <span className="font-mono text-foreground">v2.1.0-stable (LexNova Pro)</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span>Base de Datos</span>
                            <span className="font-mono text-foreground">Supabase PostgreSQL 15</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span>Estado del Servidor</span>
                            <span className="flex items-center gap-2 font-mono text-green-400">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                OPERATIVO
                            </span>
                        </div>
                    </div>
                </CyberCard>
            </div>


            <div className="flex justify-end sticky bottom-6 z-10">
                <NeonButton onClick={handleSave} className="gap-2 shadow-xl" disabled={saving}>
                    <Save className={`h-4 w-4 ${saving ? 'animate-bounce' : ''}`} />
                    {saving ? "Guardando..." : "Guardar Configuración"}
                </NeonButton>
            </div>
        </div>
    );
}
