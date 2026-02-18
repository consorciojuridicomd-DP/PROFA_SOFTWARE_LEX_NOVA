"use client";

import { useState, useEffect } from "react";
import { CyberCard } from "@/shared/ui/CyberCard";
import { NeonButton } from "@/shared/ui/NeonButton";
import { SnowParticles } from "@/shared/ui/SnowParticles";
import { CommunitySection } from "@/shared/ui/CommunitySection";
import Link from "next/link";
import { BadgeCheck, BrainCircuit, Scale, LogIn, ShieldAlert, Zap, UserCheck } from "lucide-react";
import { useAuth } from "@/features/login/hooks/useAuth";

const homeStyles = `
@keyframes soft-pulse {
  0%, 100% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 20px rgba(255,85,0,0.4)); }
  50% { transform: scale(1.05); filter: brightness(1.2) drop-shadow(0 0 40px rgba(255,85,0,0.6)); }
}

@keyframes eye-spark {
  0%, 100% { opacity: 0; transform: scale(0); }
  5%, 15% { opacity: 1; transform: scale(1.2); filter: brightness(3); }
  10%, 20% { opacity: 0; transform: scale(0.5); }
}

@keyframes laser-beam {
  0% { transform: scaleX(0); opacity: 0; }
  20%, 80% { transform: scaleX(1); opacity: 0.5; filter: blur(1px); }
  100% { transform: scaleX(0); opacity: 0; }
}

@keyframes robot-breathing {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.01); }
}

@keyframes eye-blink-red {
  0%, 100% { opacity: 1; box-shadow: 0 0 15px #ff0000; }
  48%, 52% { opacity: 0.3; }
}

.animate-sparks {
  animation: eye-spark 3s infinite;
}

.animate-laser {
  animation: laser-beam 4s ease-in-out infinite;
  transform-origin: center;
}

.animate-robot {
  animation: robot-breathing 8s ease-in-out infinite;
}

.animate-eye-blink {
  animation: eye-blink-red 4s ease-in-out infinite;
}
`;

export default function Home() {
  const { logout } = useAuth();

  const handleExit = async () => {
    await logout();
    window.location.href = "/salir";
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden font-sans text-white flex flex-col items-center">
      <style dangerouslySetInnerHTML={{ __html: homeStyles }} />

      {/* GLOBAL LAYERS */}
      <div className="fixed inset-0 -z-30 opacity-10 pointer-events-none bg-[url('/grid.svg')] mix-blend-overlay" />
      <div className="fixed inset-0 -z-20 pointer-events-none opacity-40">
        <SnowParticles />
      </div>

      {/* Exit Button */}
      <div className="fixed top-6 right-6 z-[100]">
        <button
          onClick={handleExit}
          className="group flex items-center gap-3 bg-red-600/10 hover:bg-red-600/20 border-2 border-red-600/30 hover:border-red-600 px-6 py-3 rounded-full transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] active:scale-95 shadow-[0_0_20px_rgba(255,0,0,0.2)]"
        >
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-500 group-hover:text-red-400">Cerrar Sistema</span>
          <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center group-hover:bg-red-600 transition-colors">
            <LogIn className="w-4 h-4 text-red-500 group-hover:text-white rotate-180" />
          </div>
        </button>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center px-4 py-8 md:px-8 mt-20">

        {/* ── Central Robot Visual (RESTORED) ── */}
        <div className="w-full max-w-5xl flex flex-col items-center text-center gap-6 md:gap-10 rounded-3xl px-6 py-10 md:px-14 md:py-16 relative overflow-hidden ring-1 ring-white/20 shadow-[0_0_50px_rgba(0,0,0,0.9)] bg-black/60 backdrop-blur-xl animate-robot">

          {/* VISIBLE ROBOT IMAGE */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <img
              src="/assets/robot-portada.jpg"
              alt="Robot Background"
              className="w-full h-full object-cover object-center opacity-90 scale-105"
            />
            {/* Soft gradient overlay to keep robot visible but text legible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
          </div>

          {/* Ojos Láser Integrados (Sutiles) */}
          <div className="absolute inset-x-0 top-[38%] z-[10] flex justify-center gap-14 pointer-events-none">
            <div className="relative left-[-3%] flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-red-600 shadow-[0_0_20px_#ff0000] animate-eye-blink flex items-center justify-center">
                <Zap className="absolute text-white animate-sparks w-3 h-3 opacity-0" fill="currentColor" />
              </div>
              <div className="absolute h-[1px] w-[300px] bg-red-600/40 animate-laser blur-[1px]" />
            </div>
            <div className="relative left-[5%] flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-red-600 shadow-[0_0_20px_#ff0000] animate-eye-blink flex items-center justify-center">
                <Zap className="absolute text-white animate-sparks w-3 h-3 opacity-0" fill="currentColor" />
              </div>
              <div className="absolute h-[1px] w-[300px] bg-red-600/40 animate-laser blur-[1px]" />
            </div>
          </div>

          <div className="relative z-20 w-full flex flex-col items-center gap-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-black/80 backdrop-blur-md px-4 py-2 text-[10px] md:text-xs text-primary font-black tracking-widest shadow-[0_0_15px_rgba(255,85,0,0.3)] uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Sistema de Evaluación 31° PROFA Activo
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
              <img
                src="/assets/logo-derecho-peru.png"
                alt="Derecho Perú"
                className="h-28 w-28 md:h-36 md:w-36 object-contain rounded-full drop-shadow-[0_0_30px_rgba(255,85,0,0.8)] relative z-10"
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none text-white uppercase italic drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
                DERECHO PERÚ
              </h1>
              <h2 className="text-xl sm:text-3xl md:text-5xl font-black tracking-widest text-primary drop-shadow-[0_0_20px_rgba(255,85,0,0.5)] uppercase">
                PROFA SOFTWARE LEX NOVA
              </h2>
            </div>

            <p className="max-w-2xl text-sm md:text-lg text-white font-bold leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              Actualización inteligente para la nueva magistratura: destaca en la evaluación.
            </p>

            <Link href="/login" className="mt-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/40 transition-all duration-500 scale-150 opacity-0 group-hover:opacity-100" />
                <button className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-black/80 border-2 border-primary/30 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-primary shadow-[0_0_30px_rgba(255,85,0,0.2)]">
                  <LogIn className="w-10 h-10 text-white" strokeWidth={2.5} />
                </button>
              </div>
            </Link>
          </div>
        </div>

        {/* Credits Layer (IMPORTANT: Sergi De la Cruz) */}
        <div className="w-full max-w-5xl mt-8 px-6 flex flex-col items-center gap-2">
          <div className="h-[1px] w-20 bg-primary/50 mb-2" />
          <div className="flex items-center gap-3 text-white/80 group">
            <UserCheck size={16} className="text-primary animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-[0.2em] uppercase">Creador del Sistema:</span>
              <span className="text-sm font-bold text-primary tracking-widest uppercase italic">Mg. Sergio J. De la Cruz Zúñiga</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 font-medium text-center max-w-md mt-2 uppercase tracking-tighter">
            Especialista en Derecho Penal e IA - Perito Informático - Lex Nova System 2026.v1
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-12">
          <CyberCard
            title="Simulacros Reales"
            description="Exámenes cronometrados con la misma estructura y rigor que el examen oficial del JNJ."
            icon={<Scale className="text-primary w-6 h-6" />}
          />
          <CyberCard
            title="Análisis Predictivo"
            description="Detecta tus brechas de conocimiento por categoría y genera planes de estudio automáticos."
            icon={<BrainCircuit className="text-primary w-6 h-6" />}
          />
          <CyberCard
            title="Antifraude"
            description="Timer sincronizado con servidor y bloqueo de respuestas post-tiempo. Integridad total."
            icon={<BadgeCheck className="text-primary w-6 h-6" />}
          />
        </div>

        <div className="mt-20 w-full max-w-6xl mb-20">
          <CommunitySection />
        </div>
      </div>
    </main>
  );
}
