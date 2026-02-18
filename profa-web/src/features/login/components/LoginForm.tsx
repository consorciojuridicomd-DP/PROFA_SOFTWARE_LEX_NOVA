"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { loginService } from "../services/login.service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, RotateCcw, ShieldCheck, User as UserIcon, LogIn, Sparkles, ChevronLeft, Settings } from "lucide-react";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAdminDetected, setIsAdminDetected] = useState(false);

    const emailInputRef = useRef<HTMLInputElement>(null);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();

    // Auto-focus and Radical Clean on mount
    useEffect(() => {
        clearForm();
        emailInputRef.current?.focus();
    }, []);

    // Detect Admin Email
    useEffect(() => {
        if (email.toLowerCase() === "consorciojuridicomd@gmail.com") {
            setIsAdminDetected(true);
            setOtp(["A", "D", "M", "I"]);
        } else {
            setIsAdminDetected(false);
            if (otp.join("") === "ADMI") setOtp(["", "", "", ""]);
        }
    }, [email]);

    const handleOtpChange = (index: number, value: string) => {
        if (isAdminDetected) return; // Prevent manual change if admin detected
        const val = value.slice(-1).toUpperCase();
        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        if (val && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const clearForm = () => {
        setEmail("");
        setOtp(["", "", "", "", "", ""]);
        setError(null);
        setIsAdminDetected(false);
        emailInputRef.current?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const password = otp.join("");
        const { data, error: loginError } = await loginService.login(email, password);

        if (loginError) {
            setError("Fallo de Autenticación. Revisa tus credenciales.");
            setLoading(false);
            return;
        }

        const role = data.profile?.role;
        router.push(role === 'admin' ? '/dashboard' : '/app');
    };

    return (
        <div className="relative overflow-hidden bg-[#0A0A0A]/95 backdrop-blur-3xl border-2 border-[#FF3300]/30 p-5 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(255,51,0,0.4)] min-h-[500px] sm:min-h-[600px] w-[95%] sm:w-full max-w-[450px] mx-auto flex flex-col justify-center group/card transition-all duration-700 hover:border-[#FF3300]/60">

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
                <div className="relative w-24 h-24 mb-6 transition-transform duration-500 hover:scale-110">
                    <div className="absolute inset-0 bg-[#FF3300]/20 blur-2xl rounded-full animate-pulse"></div>
                    <Image src="/logo.png" alt="Lex Nova" fill className="object-contain relative z-10 drop-shadow-[0_0_20px_rgba(255,51,0,0.6)]" />
                </div>
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-black text-white tracking-[0.2em] text-center drop-shadow-sm uppercase">Lex Nova</h1>
                    <button
                        type="button"
                        onClick={clearForm}
                        className="p-2 bg-[#FF3300]/10 border border-[#FF3300]/30 rounded-full text-[#FF3300] hover:bg-[#FF3300] hover:text-white transition-all hover:rotate-[-180deg] duration-700 shadow-[0_0_20px_rgba(255,51,0,0.3)]"
                        title="LIMPIEZA DE MEMORIA DEL SISTEMA"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
                <div className="h-1 bg-gradient-to-r from-transparent via-[#FF3300] to-transparent w-32 mt-4 animate-glow"></div>
            </div>

            {error && (
                <div className="mb-6 bg-red-600/10 border-l-4 border-red-500 p-4 rounded-r-xl text-red-500 text-[10px] font-bold uppercase tracking-widest animate-shake">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-10 relative z-10">
                {/* Input Usuario con Icono */}
                <div className="group/field mb-8">
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-1 group-focus-within/field:text-[#FF3300] transition-colors">
                        <UserIcon size={12} className="text-gray-600 group-focus-within/field:text-[#FF3300]" />
                        CORREO ELECTRÓNICO
                    </label>
                    <div className="relative">
                        <input
                            ref={emailInputRef}
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                            onKeyPress={(e) => e.key === 'Enter' && otpRefs.current[0]?.focus()}
                            placeholder="ej. usuario@correo.com"
                            className="w-full bg-white/5 border-b-2 border-gray-900 focus:border-[#FF3300] px-4 py-4 text-white text-sm font-bold tracking-widest focus:outline-none transition-all placeholder:text-gray-800 placeholder:font-black lowercase"
                            autoComplete="off"
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                <div className="group/field mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-1 group-focus-within/field:text-[#FF3300] transition-colors">
                            <ShieldCheck size={12} className="text-gray-600 group-focus-within/field:text-[#FF3300]" />
                            CLAVE DE ACCESO
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            title={showPassword ? "Ocultar Clave" : "Mostrar Clave"}
                            className="text-gray-600 hover:text-[#FF3300] transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <div className="flex justify-between gap-1.5 sm:gap-3">
                        {otp.map((digit, idx) => (
                            <div key={idx} className="relative w-full h-14 sm:h-16 group/box">
                                <input
                                    ref={(el) => { otpRefs.current[idx] = el; }}
                                    type={showPassword ? "text" : (isAdminDetected ? "password" : "text")}
                                    value={digit}
                                    readOnly={isAdminDetected}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
                                    }}
                                    className={`w-full h-full bg-white/5 border-2 ${isAdminDetected ? 'border-[#FF3300]/50 animate-pulse' : 'border-gray-800'} focus:border-[#FF3300] rounded-lg sm:rounded-xl text-white text-center font-black text-lg sm:text-2xl focus:outline-none transition-all duration-300 ${isAdminDetected && 'cursor-not-allowed'}`}
                                    required
                                />
                                {isAdminDetected && <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF3300] rounded-full animate-ping"></div>}
                            </div>
                        ))}
                    </div>

                    {isAdminDetected && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-[9px] text-[#FF3300] font-black uppercase tracking-[0.2em] animate-pulse">
                            <Sparkles size={10} />
                            Acceso Administrativo Detectado
                        </div>
                    )}
                </div>

                {/* Botón Iconográfico Sugerente */}
                <div className="pt-4 flex flex-col items-center gap-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-20 h-20 rounded-full bg-gradient-to-br from-[#FF3300] to-[#990000] p-[2px] shadow-[0_0_20px_rgba(255,51,0,0.3)] hover:shadow-[0_0_40px_rgba(255,51,0,0.6)] transition-all duration-500 active:scale-90 flex items-center justify-center disabled:grayscale"
                        title={isAdminDetected ? "Ingresar Directamente al Panel" : "Autenticar Sistema"}
                    >
                        <div className="absolute inset-0 rounded-full blur-[10px] bg-[#FF3300]/40 group-hover:blur-[15px] transition-all"></div>
                        <div className="relative w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FF3300]/20 to-transparent group-hover:opacity-100 transition-opacity"></div>
                            <LogIn className="w-8 h-8 text-white group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                        </div>
                        {/* Tooltip personalizado */}
                        <span className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold text-white uppercase tracking-[0.3em] whitespace-nowrap bg-black/80 px-4 py-2 rounded-full border border-white/10">
                            {isAdminDetected ? "Ingresar Directamente" : "Autenticar Sistema"}
                        </span>
                    </button>

                    <div className="flex flex-col sm:flex-row justify-between items-center w-full px-2 border-t border-white/10 pt-8 mt-4 relative gap-4 sm:gap-6">
                        {/* Glow ambient background for links */}
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF3300]/50 to-transparent"></div>

                        <Link
                            href="/register"
                            className="group/link flex items-center gap-2 text-gray-500 hover:text-[#FF3300] text-[10px] font-black transition-all uppercase tracking-[0.3em] hover:scale-105 active:scale-95 relative whitespace-nowrap"
                        >
                            <span className="relative z-10">Crear Alumno</span>
                            <div className="absolute -inset-2 bg-[#FF3300]/0 group-hover/link:bg-[#FF3300]/5 blur-lg rounded-full transition-all"></div>
                            <Sparkles size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity animate-pulse text-[#FF3300]" />
                        </Link>

                        <div className="flex items-center gap-5">
                            <button
                                type="button"
                                onClick={() => setError("Módulo de Recuperación en Mantenimiento: Contacte al Soporte Técnico.")}
                                className="group/link flex items-center gap-2 text-gray-500 hover:text-white text-[10px] font-black transition-all uppercase tracking-[0.3em] hover:scale-105 active:scale-95 relative whitespace-nowrap"
                            >
                                <div className="absolute -inset-2 bg-white/0 group-hover/link:bg-white/5 blur-lg rounded-full transition-all"></div>
                                <span className="relative z-10">Recuperar</span>
                                <Sparkles size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity animate-pulse text-white" />
                            </button>

                            {/* Separador vertical sutil */}
                            <div className="h-4 w-px bg-white/10 ml-2"></div>

                            {/* Gear Icon for Admin Master Control */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (isAdminDetected) {
                                        router.push('/admin/users');
                                    } else {
                                        setError("Acceso Restringido: Requiere Protocolo Admin.");
                                    }
                                }}
                                title="Centro de Mando Cybermatic"
                                className="p-2 text-gray-600 hover:text-[#FF3300] transition-all hover:scale-125 hover:rotate-90 duration-500 relative group/gear"
                            >
                                <Settings size={18} className={`animate-[spin_8s_linear_infinite] ${isAdminDetected ? 'text-[#FF3300]' : ''}`} />
                                {isAdminDetected && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF3300] rounded-full animate-ping"></div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="mt-12 text-center relative z-10">
                <span className="text-[10px] text-gray-800 font-black uppercase tracking-[0.6em] animate-pulse">
                    LEX NOVA SYSTEM 2026.V1
                </span>
            </div>
        </div>
    );
}
