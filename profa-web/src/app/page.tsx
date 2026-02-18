"use client";

import { useState, useEffect } from "react";
import { CyberCard } from "@/shared/ui/CyberCard";
import { NeonButton } from "@/shared/ui/NeonButton";
import { SnowParticles } from "@/shared/ui/SnowParticles";
import { CommunitySection } from "@/shared/ui/CommunitySection";
import Link from "next/link";
import { BadgeCheck, BrainCircuit, Scale, LogIn, ShieldAlert, Zap } from "lucide-react";
import { useAuth } from "@/features/login/hooks/useAuth";

const homeStyles = `
@keyframes soft-pulse {
  0%, 100% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 20px rgba(255,85,0,0.4)); }
  50% { transform: scale(1.05); filter: brightness(1.3) drop-shadow(0 0 50px rgba(255,85,0,0.7)); }
}

@keyframes eye-spark {
  0%, 100% { opacity: 0; transform: scale(0); }
  5% { opacity: 1; transform: scale(1.5); filter: brightness(3) blur(1px); }
  10% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 0; }
  55% { opacity: 1; transform: scale(2); filter: brightness(4) blur(2px); }
  60% { opacity: 0; }
}

@keyframes glitch-shake {
  0%, 100% { transform: translate(0); }
  2% { transform: translate(-3px, 2px) rotate(1deg); }
  4% { transform: translate(3px, -2px) rotate(-1deg); }
  6% { transform: translate(-3px, -1px); }
  8% { transform: translate(0); }
}

@keyframes laser-beam {
  0% { transform: scaleX(0); opacity: 0; }
  15%, 85% { transform: scaleX(1); opacity: 0.7; filter: blur(1px) brightness(2); }
  100% { transform: scaleX(0); opacity: 0; }
}

@keyframes logo-explosion {
  0% { transform: scale(0); opacity: 0; filter: brightness(5) blur(50px); }
  40% { transform: scale(1.3); opacity: 1; filter: brightness(10) blur(20px); }
  70% { transform: scale(0.95); opacity: 1; filter: brightness(2) blur(5px); }
  100% { transform: scale(1); opacity: 1; filter: brightness(1) blur(0px); }
}

@keyframes robot-breathing {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.02); }
}

@keyframes eye-blink-red {
  0%, 100% { opacity: 1; box-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000; }
  48%, 52% { opacity: 0; box-shadow: 0 0 0px #ff0000; }
}

.animate-sparks {
  animation: eye-spark 2s infinite;
}

.animate-glitch {
  animation: glitch-shake 4s linear infinite;
}

.animate-laser {
  animation: laser-beam 3s ease-in-out infinite;
  transform-origin: center;
}

.animate-explosion {
  animation: logo-explosion 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

.animate-robot {
  animation: robot-breathing 6s ease-in-out infinite;
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
    <main className="relative min-h-screen w-full overflow-hidden font-sans text-white flex flex-col items-center justify-center">
      <style dangerouslySetInnerHTML={{ __html: homeStyles }} />

      {/* A) GLOBAL LAYERS */}
      <div className="fixed inset-0 -z-30 opacity-10 pointer-events-none bg-[url('/grid.svg')] mix-blend-overlay" />
      <div className="fixed inset-0 -z-20 pointer-events-none opacity-40">
        <SnowParticles />
      </div>

      {/* ── Fixed Exit Button ── */}
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

      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 py-8 md:px-8 animate-explosion">

        {/* ── Central Robot Visual ── */}
        <div className="w-full max-w-5xl flex flex-col items-center text-center gap-6 md:gap-10 rounded-3xl px-6 py-10 md:px-14 md:py-16 relative overflow-hidden ring-1 ring-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-black/40 backdrop-blur-xl animate-robot">

          {/* Ambient Background Robot */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-60">
            <img
              src="/assets/robot-portada.jpg"
              alt="Robot Background"
              className="w-full h-full object-cover object-center scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>

          <div className="absolute inset-0 bg-black/30 z-[1]" />

          {/* 1. Ojos con Chispazos y Glitch */}
          <div className="absolute inset-x-0 top-[38%] z-[10] flex justify-center gap-14 pointer-events-none animate-glitch">
            {/* Ojo Izquierdo */}
            <div className="relative left-[-3%] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-red-600 shadow-[0_0_30px_#ff0000,0_0_60px_#ff0000] animate-eye-blink relative flex items-center justify-center">
                {/* Chispazo */}
                <Zap className="absolute text-white animate-sparks w-4 h-4 opacity-0" fill="currentColor" />
                <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff]" />
              </div>
              {/* Láser escáner */}
              <div className="absolute h-[1px] w-[500px] bg-gradient-to-r from-red-600/60 to-transparent animate-laser blur-[1px]" />
            </div>
            {/* Ojo Derecho */}
            <div className="relative left-[5%] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-red-600 shadow-[0_0_30px_#ff0000,0_0_60px_#ff0000] animate-eye-blink relative flex items-center justify-center">
                {/* Chispazo */}
                <Zap className="absolute text-white animate-sparks w-4 h-4 opacity-0" fill="currentColor" />
                <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff]" />
              </div>
              {/* Láser escáner */}
              <div className="absolute h-[1px] w-[500px] bg-gradient-to-l from-red-600/60 to-transparent animate-laser blur-[1px]" />
            </div>
          </div>

          {/* ── Content Area ── */}
          <div className="relative z-10 w-full flex flex-col items-center gap-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-black/60 backdrop-blur-md px-4 py-2 text-xs text-primary shadow-[0_0_15px_rgba(255,85,0,0.3)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              SISTEMA DE EVALUACIÓN 31° PROFA ACTIVO
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
              <img
                src="/assets/logo-derecho-peru.png"
                alt="Derecho Perú"
                className="h-32 w-32 md:h-40 md:w-40 object-contain drop-shadow-[0_0_30px_rgba(255,85,0,0.6)] hover:scale-110 transition-transform duration-500 relative z-10"
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none text-white uppercase italic drop-shadow-[0_5px_15px_rgba(0,0,0,1)]">
                DERECHO PERÚ
              </h1>
              <p className="text-xl md:text-4xl font-black tracking-[0.4em] text-primary uppercase drop-shadow-[0_0_20px_rgba(255,85,0,0.5)]">
                PROFA SOFTWARE LEX NOVA
              </p>
            </div>

            <p className="max-w-xl text-sm md:text-lg text-gray-300 font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Actualización inteligente para la nueva magistratura: destaca en la evaluación.
            </p>

            <Link href="/login" className="mt-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/40 transition-all duration-500 scale-150" />
                <button className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-black border-2 border-primary/30 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-primary shadow-[0_0_30px_rgba(255,85,0,0.2)] group-hover:shadow-[0_0_50px_rgba(255,85,0,0.4)]">
                  <LogIn className="w-10 h-10 text-white transition-transform duration-500 group-hover:translate-x-1" strokeWidth={2.5} />
                </button>
              </div>
            </Link>
          </div>
        </div>

        {/* ── Feature Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-10">
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

        <div className="mt-20 w-full max-w-6xl">
          <CommunitySection />
        </div>
      </div>
    </main>
  );
}
