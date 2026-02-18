"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { loginService } from "../services/login.service";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, RotateCcw, UserPlus, Mail, Fingerprint, User, Sparkles, ChevronLeft } from "lucide-react";

export function RegisterForm() {
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        dni: "",
    });
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const nameInputRef = useRef<HTMLInputElement>(null);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();

    // Auto-focus on start
    useEffect(() => {
        clearForm();
        nameInputRef.current?.focus();
    }, []);

    const handleOtpChange = (index: number, value: string) => {
        const val = value.slice(-1).toUpperCase();
        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        if (val && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const clearForm = () => {
        setFormData({ email: "", fullName: "", dni: "" });
        setOtp(["", "", "", "", "", ""]);
        setError(null);
        nameInputRef.current?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const password = otp.join("");
        if (password.length < 6) {
            setError("La clave debe tener exactamente 6 dígitos para cumplir con la seguridad del sistema.");
            setLoading(false);
            return;
        }

        if (formData.dni.length !== 8) {
            setError("El DNI debe tener exactamente 8 dígitos.");
            setLoading(false);
            return;
        }

        try {
            const { error: registerError } = await loginService.register(
                formData.email.toLowerCase(),
                password,
                formData.fullName.toUpperCase(),
                formData.dni
            );

            if (registerError) {
                setError(registerError.message || "Error al registrar el usuario.");
                setLoading(false);
                return;
            }

            setSuccess(true);
            setLoading(false);
            clearForm(); // Clear form after successful registration
        } catch (err: any) {
            setError(err.message || "Ocurrió un error inesperado durante el registro.");
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="relative overflow-hidden bg-[#0A0A0A]/95 backdrop-blur-3xl border-2 border-[#00FF66]/30 p-12 rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(0,255,102,0.3)] min-h-[500px] flex flex-col justify-center items-center text-center">
                <div className="w-24 h-24 bg-[#00FF66]/10 rounded-full flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-[#00FF66]/20 blur-xl rounded-full animate-pulse"></div>
                    <Sparkles className="w-12 h-12 text-[#00FF66] relative z-10" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">Aspirante Registrado</h2>
                <div className="h-1 w-20 bg-[#00FF66] mb-6"></div>
                <p className="text-gray-400 text-xs font-bold tracking-widest leading-relaxed max-w-xs">
                    TU CUENTA HA SIDO VINCULADA AL SISTEMA LEX NOVA.<br />
                    PREPARANDO PANEL DE ACCESO...
                </p>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-[#0A0A0A]/95 backdrop-blur-3xl border-2 border-[#FF3300]/30 p-5 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(255,51,0,0.4)] min-h-[600px] w-[95%] sm:w-full max-w-[550px] mx-auto flex flex-col justify-center group/card transition-all duration-700 hover:border-[#FF3300]/60">

            {/* Return to Home Button */}
            <Link
                href="/"
                className="absolute top-6 left-6 z-20 group/back flex items-center gap-2 text-[8px] font-black text-gray-600 hover:text-white uppercase tracking-[0.2em] transition-all"
                title="Volver al Inicio"
            >
                <div className="w-8 h-8 rounded-full border border-[#FF3300]/50 flex items-center justify-center animate-semaphore group-hover/back:scale-110 transition-all">
                    <ChevronLeft size={14} className="group-hover/back:-translate-x-1 transition-transform text-white" />
                </div>
                <span className="opacity-0 group-hover/back:opacity-100 transition-opacity whitespace-nowrap">Retorno al Sistema</span>
            </Link>

            {/* Circuit Pattern BG */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none group-hover/card:opacity-[0.08] transition-opacity duration-1000">
                <Image src="/circuits.svg" alt="" fill className="object-cover scale-110" />
            </div>

            <div className="flex flex-col items-center mb-8 relative z-10">
                <div className="relative w-20 h-20 mb-6 drop-shadow-[0_0_15px_rgba(255,51,0,0.5)] transition-transform hover:scale-110 duration-500">
                    <div className="absolute inset-0 bg-[#FF3300]/10 blur-xl rounded-full animate-pulse"></div>
                    <Image src="/logo.png" alt="Lex Nova" fill className="object-contain relative z-10" />
                </div>
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-black text-white tracking-[0.2em] text-center uppercase">Alta de Aspirante</h1>
                    <button
                        type="button"
                        onClick={clearForm}
                        className="p-2 bg-[#FF3300]/10 border border-[#FF3300]/30 rounded-full text-[#FF3300] hover:bg-[#FF3300] hover:text-white transition-all hover:rotate-[-180deg] duration-700 shadow-[0_0_15px_rgba(255,51,0,0.2)]"
                        title="RESETEO MAESTRO DE DATOS"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
                <div className="h-1 bg-gradient-to-r from-transparent via-[#FF3300] to-transparent w-24 mt-4"></div>
            </div>

            {error && (
                <div className="mb-6 bg-red-600/10 border-l-4 border-red-500 p-4 rounded-r-xl text-red-500 text-[9px] font-black uppercase tracking-widest animate-shake">
                    {error}
                </div>
            )}

            {success ? (
                <div className="bg-[#00FF66]/10 border border-[#00FF66]/30 p-6 rounded-xl text-center space-y-4 animate-in fade-in zoom-in duration-500 relative z-10">
                    <div className="w-16 h-16 bg-[#00FF66]/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Sparkles size={32} className="text-[#00FF66]" />
                    </div>
                    <h2 className="text-[#00FF66] font-black text-xl uppercase tracking-widest">¡REGISTRO EXITOSO!</h2>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Espera la aprobación del <span className="text-[#00FF66] font-bold">ADMINISTRADOR</span> para que puedas explorar todo tu potencial en el sistema.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-4 mt-6 bg-[#00FF66]/20 border border-[#00FF66]/50 text-[#00FF66] font-black uppercase tracking-[0.3em] hover:bg-[#00FF66] hover:text-black transition-all rounded-lg"
                    >
                        ENTENDIDO, VOLVER
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group/field">
                            <label className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1 group-focus-within/field:text-[#FF3300] transition-colors">
                                <User size={10} /> Nombre Completo
                            </label>
                            <input
                                ref={nameInputRef}
                                type="text"
                                value={formData.fullName.toUpperCase()}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })}
                                disabled={loading}
                                className="w-full bg-white/5 border-b border-gray-800 focus:border-[#FF3300] px-4 py-3 text-white text-xs font-bold focus:outline-none transition-all placeholder:text-gray-700 uppercase"
                                placeholder="EJ. JUAN PEREZ"
                                required
                            />
                        </div>
                        <div className="group/field">
                            <label className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1 group-focus-within/field:text-[#FF3300] transition-colors">
                                <Fingerprint size={10} /> DNI (8 DÍGITOS)
                            </label>
                            <input
                                type="text"
                                value={formData.dni}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    if (val.length <= 8) setFormData({ ...formData, dni: val });
                                }}
                                disabled={loading}
                                className="w-full bg-white/5 border-b border-gray-800 focus:border-[#FF3300] px-4 py-3 text-white text-xs font-bold focus:outline-none transition-all placeholder:text-gray-700 uppercase"
                                placeholder="00000000"
                                required
                            />
                        </div>
                    </div>

                    <div className="group/field relative">
                        <label className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1 group-focus-within/field:text-[#FF3300] transition-colors">
                            <Mail size={10} /> CORREO ELECTRÓNICO
                        </label>
                        <input
                            type="email"
                            value={formData.email.toLowerCase()}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                            disabled={loading}
                            className="w-full bg-white/5 border-b border-gray-800 focus:border-[#FF3300] px-4 py-3 text-white text-xs font-bold focus:outline-none transition-all placeholder:text-gray-700"
                            placeholder="ejemplo@correo.com"
                            required
                        />
                        <button
                            type="button"
                            onClick={clearForm}
                            className="absolute right-2 top-8 text-gray-600 hover:text-white transition-all"
                            title="Limpiar Formulario"
                        >
                            <RotateCcw size={14} />
                        </button>
                    </div>

                    <div className="group/field">
                        <div className="flex justify-between items-center mb-4">
                            <label className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 group-focus-within/field:text-[#FF3300] transition-colors">
                                CLAVE DE SEGURIDAD
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-600 hover:text-[#FF3300] transition-colors"
                            >
                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                        <div className="flex justify-between gap-1.5 sm:gap-4">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={(el) => { otpRefs.current[idx] = el; }}
                                    disabled={loading}
                                    type={showPassword ? "text" : "password"}
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
                                    }}
                                    className="w-full h-12 sm:h-14 bg-white/5 border-2 border-gray-800 focus:border-[#FF3300] rounded-lg sm:rounded-xl text-white text-center font-black text-lg sm:text-xl focus:outline-none transition-all disabled:opacity-50"
                                    required
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col items-center gap-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-20 h-20 rounded-full bg-gradient-to-br from-[#FF3300] to-[#660000] p-[2px] shadow-[0_0_20px_rgba(255,51,0,0.3)] hover:shadow-[0_0_40px_rgba(255,51,0,0.5)] transition-all duration-500 active:scale-95 flex items-center justify-center disabled:grayscale"
                        >
                            <div className="absolute inset-0 rounded-full blur-[10px] bg-[#FF3300]/30 group-hover:blur-[15px] transition-all"></div>
                            <div className="relative w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                <UserPlus className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
                            </div>
                            {/* Tooltip */}
                            <span className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold text-white uppercase tracking-[0.3em] whitespace-nowrap bg-black/80 px-4 py-2 rounded-full border border-white/10">
                                {loading ? "Registrando..." : "Crear Cuenta Aspirante"}
                            </span>
                        </button>

                        <div className="text-center">
                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em]">
                                ¿Ya estás en el sistema? {" "}
                                <Link href="/login" className="text-[#FF3300] hover:text-white transition-colors border-b border-[#FF3300]/30">Ingresar</Link>
                            </p>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
