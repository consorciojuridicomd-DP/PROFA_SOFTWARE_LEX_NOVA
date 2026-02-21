"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/shared/lib/supabase/client"
import {
    User, Mail, CreditCard, Phone, BookOpen,
    CheckCircle, AlertCircle, ArrowLeft, Send, Loader2
} from "lucide-react"

const ESPECIALIDADES = [
    "Derecho Penal",
    "Derecho Civil",
    "Derecho Constitucional",
    "Derecho Procesal Penal",
    "Derecho Procesal Civil",
    "Derecho Administrativo",
    "Argumentación Jurídica",
    "General / Mixto"
]

export default function RegistroPage() {
    const [step, setStep] = useState<"form" | "success">("form")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        dni: "",
        phone: "",
        especialidad: "",
        mensaje: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!form.full_name.trim() || !form.email.trim() || !form.dni.trim()) {
            setError("Por favor completa todos los campos obligatorios.")
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError("El correo electrónico no es válido.")
            return
        }
        if (form.dni.length < 8) {
            setError("El DNI debe tener al menos 8 dígitos.")
            return
        }

        setLoading(true)
        try {
            const supabase = createClient()
            const { error: insertError } = await supabase
                .from("registration_requests")
                .insert({
                    full_name: form.full_name.trim(),
                    email: form.email.trim().toLowerCase(),
                    dni: form.dni.trim(),
                    phone: form.phone.trim() || null,
                    especialidad: form.especialidad || null,
                    mensaje: form.mensaje.trim() || null,
                    status: "pending"
                })

            if (insertError) {
                if (insertError.code === "23505") {
                    setError("Ya existe una solicitud con ese correo o DNI. Contacta al administrador.")
                } else {
                    setError(insertError.message)
                }
                return
            }

            setStep("success")
        } catch (err: any) {
            setError(err.message || "Error al enviar la solicitud.")
        } finally {
            setLoading(false)
        }
    }

    if (step === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
                <div className="w-full max-w-md text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(0,255,102,0.2)]">
                        <CheckCircle className="w-12 h-12 text-green-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">¡Solicitud Enviada!</h1>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Tu solicitud de acceso ha sido recibida. El administrador la revisará y recibirás tus credenciales de acceso por correo electrónico.
                        </p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4 text-left">
                        <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">Próximos pasos</p>
                        {["El admin revisará tu solicitud", "Recibirás un correo con tus credenciales", "Podrás iniciar sesión con tu DNI como clave inicial"].map((step, i) => (
                            <div key={i} className="flex items-center gap-3 text-gray-400 text-sm mt-2">
                                <span className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                                {step}
                            </div>
                        ))}
                    </div>
                    <Link href="/" className="inline-flex items-center gap-2 text-[#FF3300] hover:text-white transition-colors text-sm font-bold">
                        <ArrowLeft size={16} /> Volver al inicio
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 py-12">
            {/* Header */}
            <div className="w-full max-w-lg mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FF3300] transition-colors text-sm font-bold mb-6">
                    <ArrowLeft size={16} /> Volver al inicio
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF3300] animate-pulse" />
                    <span className="text-[#FF3300] font-black text-[10px] uppercase tracking-[0.5em]">31° PROFA — Sistema de Registro</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight">
                    Solicitar <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3300] to-orange-400">Acceso</span>
                </h1>
                <p className="text-gray-500 text-sm mt-2">Completa el formulario. El administrador revisará y aprobará tu acceso.</p>
            </div>

            {/* Card */}
            <div className="w-full max-w-lg relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FF3300]/20 to-transparent rounded-[2rem] blur-xl" />
                <div className="relative bg-[#0A0A0A] border border-white/[0.07] rounded-[2rem] p-8 md:p-10 space-y-6">

                    {error && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            <AlertCircle size={18} className="flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nombre */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <User size={12} className="text-[#FF3300]" /> Nombre Completo *
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                value={form.full_name}
                                onChange={handleChange}
                                placeholder="Ej: Juan Pérez García"
                                required
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-[#FF3300]/50 transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Mail size={12} className="text-[#FF3300]" /> Correo Electrónico *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                                required
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-[#FF3300]/50 transition-all"
                            />
                        </div>

                        {/* DNI y Teléfono */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <CreditCard size={12} className="text-[#FF3300]" /> DNI *
                                </label>
                                <input
                                    type="text"
                                    name="dni"
                                    value={form.dni}
                                    onChange={handleChange}
                                    placeholder="12345678"
                                    maxLength={20}
                                    required
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-[#FF3300]/50 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <Phone size={12} className="text-[#FF3300]" /> Teléfono
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="999 888 777"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-[#FF3300]/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Especialidad */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <BookOpen size={12} className="text-[#FF3300]" /> Especialidad / Área de Interés
                            </label>
                            <select
                                name="especialidad"
                                value={form.especialidad}
                                onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF3300]/50 transition-all appearance-none"
                            >
                                <option value="" className="bg-[#0A0A0A]">Selecciona una especialidad...</option>
                                {ESPECIALIDADES.map(e => (
                                    <option key={e} value={e} className="bg-[#0A0A0A]">{e}</option>
                                ))}
                            </select>
                        </div>

                        {/* Mensaje */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">
                                Mensaje / Motivación (opcional)
                            </label>
                            <textarea
                                name="mensaje"
                                value={form.mensaje}
                                onChange={handleChange}
                                placeholder="Cuéntanos brevemente tu motivación para el PROFA..."
                                rows={3}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-[#FF3300]/50 transition-all resize-none"
                            />
                        </div>

                        {/* Aviso legal */}
                        <p className="text-[10px] text-gray-700 leading-relaxed">
                            * Al enviar este formulario, autorizas el tratamiento de tus datos para gestionar tu acceso al sistema de preparación PROFA. Los datos son confidenciales y no serán compartidos.
                        </p>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF3300] to-orange-500 text-black font-black text-sm uppercase tracking-widest transition-all hover:shadow-[0_0_30px_rgba(255,51,0,0.4)] hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <><Loader2 size={18} className="animate-spin" /> Enviando...</>
                            ) : (
                                <><Send size={18} /> Solicitar Acceso</>
                            )}
                        </button>
                    </form>

                    {/* Login link */}
                    <div className="text-center text-sm text-gray-600">
                        ¿Ya tienes acceso?{" "}
                        <Link href="/login" className="text-[#FF3300] hover:text-white font-bold transition-colors">
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
