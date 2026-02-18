"use client";

import { useEffect } from "react";
import { LogOut, ShieldAlert } from "lucide-react";

export default function SalirPage() {
    useEffect(() => {
        // Limpieza absoluta de memoria local
        localStorage.clear();
        sessionStorage.clear();

        // El JEFE quiere abandono absoluto. No hay vuelta atrás.
        // Podríamos redirigir a una URL externa o simplemente mostrar el estado de SHUTDOWN.
    }, []);

    return (
        <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-sans overflow-hidden relative">
            {/* Animación de fondo de apagado */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/5 to-transparent pointer-events-none animate-pulse" />

            <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-md w-full">
                <div className="relative">
                    <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 animate-pulse" />
                    <div className="w-24 h-24 rounded-full border-4 border-red-600/30 flex items-center justify-center relative bg-black">
                        <LogOut size={40} className="text-red-600 animate-in zoom-in duration-500" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-white tracking-[0.2em] uppercase italic drop-shadow-[0_0_20px_rgba(255,0,0,0.4)]">
                        SISTEMA CERRADO
                    </h1>
                    <div className="h-1 w-24 bg-red-600 mx-auto rounded-full" />
                    <p className="text-red-500/80 text-[10px] font-black tracking-[0.4em] uppercase">
                        Protocolo de Abandono Absoluto Ejecutado
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl space-y-4 w-full">
                    <div className="flex items-center gap-3 text-white/60 text-xs">
                        <ShieldAlert size={14} className="text-red-500" />
                        <span className="font-medium">Tu sesión ha sido destruida de forma segura.</span>
                    </div>
                    <p className="text-gray-500 text-[9px] leading-relaxed uppercase tracking-widest text-left">
                        Toda información temporal ha sido purgada del dispositivo. El acceso ha sido revocado.
                        Es seguro cerrar esta ventana del navegador ahora.
                    </p>
                </div>

                <button
                    onClick={() => window.location.href = "/login"}
                    className="mt-4 text-[10px] font-black text-white/30 hover:text-red-500 uppercase tracking-[0.5em] transition-all border-b border-white/5 hover:border-red-500/50 pb-1"
                >
                    Reiniciar Aplicativo
                </button>
            </div>

            <div className="fixed bottom-10 opacity-20">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.8em]">
                    LEX NOVA SECURE EXIT
                </span>
            </div>
        </main>
    );
}
