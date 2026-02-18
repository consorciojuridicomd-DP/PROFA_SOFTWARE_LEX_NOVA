"use client";

import { CyberCard } from "@/shared/ui/CyberCard";
import { NeonButton } from "@/shared/ui/NeonButton";
import { SnowParticles } from "@/shared/ui/SnowParticles";
import { CommunitySection } from "@/shared/ui/CommunitySection";
import Link from "next/link";
import { BadgeCheck, BrainCircuit, Scale, LogIn, ArrowRight } from "lucide-react";
import { useAuth } from "@/features/login/hooks/useAuth";

const homeStyles = `
@keyframes eye-glow {
  0%, 100% { opacity: 0.5; filter: brightness(1) blur(2px); }
  50% { opacity: 1; filter: brightness(2.2) blur(5px); }
}

@keyframes content-fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-eye {
  animation: eye-glow 3s ease-in-out infinite;
}

.animate-content {
  animation: content-fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
`;

export default function Home() {
  const { logout } = useAuth();

  const handleExit = async () => {
    await logout();
    window.location.href = "/salir";
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black font-sans text-white flex flex-col items-center">
      <style dangerouslySetInnerHTML={{ __html: homeStyles }} />

      {/* ── EFECTO NIEVE (RESTAURADO POR MANDATO DEL JEFE) ── */}
      <div className="fixed inset-0 -z-20 pointer-events-none opacity-40">
        <SnowParticles />
      </div>

      {/* BOTÓN SALIR DISCRETO Y FUNCIONAL */}
      <div className="fixed top-6 right-6 z-[100]">
        <button
          onClick={handleExit}
          className="group flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 px-4 py-2 rounded-full transition-all text-red-500 shadow-[0_0_15px_rgba(255,0,0,0.1)]"
        >
          <span className="text-[10px] font-black tracking-widest uppercase">Cerrar Sistema</span>
          <LogIn className="w-4 h-4 rotate-180" />
        </button>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center px-4 py-8 md:px-8 mt-4 animate-content">

        {/* ── TARJETA PADRE (CLON MILIMÉTRICO DE CAPTURA 2) ── */}
        <div className="w-full max-w-5xl rounded-[40px] overflow-hidden relative border border-white/10 shadow-[0_0_80px_rgba(0,0,0,1)] bg-[#050505] flex flex-col items-center min-h-[85vh]">

          {/* FONDO ROBOT (PRECISIÓN TOTAL DE IMAGEN) */}
          <div className="absolute inset-0 -z-10">
            <img
              src="/assets/robot-portada.png"
              alt="Robot Sentinel"
              className="w-full h-full object-cover object-top opacity-100"
            />
            {/* Overlay sutil para legibilidad manteniendo el arte visual de la captura */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/95" />
          </div>

          {/* BRILLO DE OJOS RÍTMICO SUDIL (MATCH EXACTO) */}
          <div className="absolute inset-x-0 top-[37.85%] z-20 flex justify-center gap-[54px] md:gap-14 pointer-events-none">
            <div className="relative left-[-2.9%]">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-red-600 shadow-[0_0_30px_#ff0000,0_0_60px_#ff0000] animate-eye" />
            </div>
            <div className="relative left-[4.8%]">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-red-600 shadow-[0_0_30px_#ff0000,0_0_60px_#ff0000] animate-eye" />
            </div>
          </div>

          {/* BLOQUE DE CONTENIDO (LAYOUT CAPTURA) */}
          <div className="relative z-30 flex flex-col items-center w-full px-4 pt-10 md:pt-16 gap-6 h-full">

            {/* Pill de Estado */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-black/90 px-4 py-1.5 text-[9px] md:text-[10px] text-orange-500 font-black tracking-[0.2em] uppercase">
              <span className="h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
              Sistema de Evaluación 31° PROFA Activo
            </div>

            {/* Logo Central con Glow Naranja Potente */}
            <div className="relative group mt-2">
              <div className="absolute inset-0 bg-orange-600/30 blur-3xl rounded-full scale-125 group-hover:scale-150 transition-transform" />
              <img
                src="/assets/logo-derecho-peru.png"
                alt="Derecho Perú"
                className="h-24 w-24 md:h-36 md:w-36 object-contain rounded-full border border-white/5 shadow-[0_0_50px_rgba(255,85,0,0.7)] relative z-10"
              />
            </div>

            {/* Títulos Maestrantes (Captura 2 Estilo) */}
            <div className="text-center space-y-0 md:space-y-1 max-w-4xl mt-4">
              <h1 className="text-[55px] sm:text-[80px] md:text-[135px] font-black italic tracking-tighter text-white uppercase drop-shadow-[0_12px_24px_rgba(0,0,0,1)] leading-[0.8] select-none">
                DERECHO PERÚ
              </h1>
              <h2 className="text-[22px] sm:text-[35px] md:text-[68px] font-black tracking-[0.25em] text-orange-600 uppercase drop-shadow-[0_4px_12px_rgba(255,85,0,0.5)] select-none">
                PROFA SOFTWARE LEX NOVA
              </h2>
              <p className="text-[10px] md:text-xl text-white font-black uppercase tracking-widest mt-6 md:mt-8 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] px-4 opacity-95">
                Actualización inteligente para la nueva magistratura: destaca en la evaluación.
              </p>
            </div>

            {/* Botón Central con Flecha (Clon Captura) */}
            <Link href="/login" className="mb-4 mt-2">
              <div className="w-18 h-18 md:w-24 md:h-24 rounded-full bg-black border-2 border-white/20 flex items-center justify-center hover:scale-110 hover:border-orange-500 transition-all duration-500 shadow-[0_0_40px_rgba(0,0,0,0.8)] group">
                <ArrowRight className="w-8 h-8 md:w-12 md:h-12 text-white transition-transform group-hover:translate-x-1" strokeWidth={3} />
              </div>
            </Link>

            {/* ── CARDS DE FEATURES (DENTRO DEL ROBOT - MATCH CAPTURA 2) ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-auto pb-10 md:pb-16 px-2">
              <div className="bg-black/75 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-2xl text-left hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-600/20 p-2 rounded-lg shadow-inner"><Scale className="text-orange-500 w-5 h-5" /></div>
                  <span className="font-black text-xs uppercase tracking-widest">Simulacros Reales</span>
                </div>
                <p className="text-[11px] text-gray-300 font-bold leading-relaxed px-1">Exámenes cronometrados con la misma estructura y rigor que el examen oficial del JNJ.</p>
              </div>

              <div className="bg-black/75 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-2xl text-left hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-600/20 p-2 rounded-lg shadow-inner"><BrainCircuit className="text-orange-500 w-5 h-5" /></div>
                  <span className="font-black text-xs uppercase tracking-widest">Análisis Predictivo</span>
                </div>
                <p className="text-[11px] text-gray-300 font-bold leading-relaxed px-1">Detecta tus brechas de conocimiento por categoría y genera planes de estudio automáticos.</p>
              </div>

              <div className="bg-black/75 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-2xl text-left hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-600/20 p-2 rounded-lg shadow-inner"><BadgeCheck className="text-orange-500 w-5 h-5" /></div>
                  <span className="font-black text-xs uppercase tracking-widest">Antifraude</span>
                </div>
                <p className="text-[11px] text-gray-200 font-bold leading-relaxed px-1">Timer sincronizado con servidor y bloqueo de respuestas post-tiempo. Integridad total.</p>
              </div>
            </div>

          </div>
        </div>

        {/* ── SECCIÓN COMUNIDAD ── */}
        <div className="w-full max-w-5xl mt-12 mb-10">
          <CommunitySection />
        </div>

        {/* ── CREDITOS FINALES (DISEÑO MAESTRO CAPTURA 2) ── */}
        <div className="w-full max-w-4xl text-center space-y-4 mb-24 mt-6">
          <div className="h-[1px] w-24 bg-orange-600/30 mx-auto" />
          <p className="text-[10px] md:text-xs text-gray-500 font-black uppercase tracking-[0.5em]">Desarrollado por:</p>
          <div className="bg-[#050505] border border-white/5 px-8 py-8 md:px-12 md:py-10 rounded-[30px] shadow-[0_0_50px_rgba(0,0,0,0.9)] ring-1 ring-white/10 max-w-2xl mx-auto backdrop-blur-xl">
            <h3 className="text-xl md:text-[42px] font-black text-white uppercase tracking-widest italic leading-none select-none drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              Mg. Sergio J. De la Cruz Zúñiga
            </h3>
            <p className="text-[9px] md:text-[13px] text-orange-600 font-black uppercase tracking-[0.15em] mt-4 select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              ESPECIALISTA EN DERECHO PROCESAL PENAL E INTELIGENCIA ARTIFICIAL - PERITO INFORMÁTICO
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
