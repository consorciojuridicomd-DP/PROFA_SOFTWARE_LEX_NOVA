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
  50% { opacity: 1; filter: brightness(2) blur(4px); }
}

.animate-eye {
  animation: eye-glow 3s ease-in-out infinite;
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

      {/* FONDO GLOBAL OSCURO */}
      <div className="fixed inset-0 -z-30 pointer-events-none opacity-20">
        <SnowParticles />
      </div>

      {/* BOTON SALIR TOTAL (FUNCIONAL) */}
      <div className="fixed top-6 right-6 z-[100]">
        <button
          onClick={handleExit}
          className="group flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 border-2 border-red-600/30 hover:border-red-600 px-4 py-2 rounded-full transition-all text-red-500 shadow-[0_0_15px_rgba(255,0,0,0.1)]"
        >
          <span className="text-[10px] font-black tracking-widest uppercase">Cerrar Sistema</span>
          <LogIn className="w-4 h-4 rotate-180" />
        </button>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center px-4 py-12 md:px-8">

        {/* ── TARJETA PADRE (CLON DE CAPTURA 2) ── */}
        <div className="w-full max-w-5xl rounded-[40px] overflow-hidden relative border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-black/60 flex flex-col items-center min-h-[85vh]">

          {/* FONDO ROBOT (CAPTURA 2: OCUPA TODO EL CONTENEDOR) */}
          <div className="absolute inset-0 -z-10 animate-fade-in">
            <img
              src="/assets/robot-portada.jpg"
              alt="Robot Sentinel"
              className="w-full h-full object-cover object-top opacity-100"
            />
            {/* Overlay sutil para legibilidad manteniendo el arte visual de la captura */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
          </div>

          {/* BRILLO DE OJOS (EXACTO EN POSICION) */}
          <div className="absolute inset-x-0 top-[37.5%] z-20 flex justify-center gap-14 pointer-events-none">
            <div className="relative left-[-2.8%]">
              <div className="w-6 h-6 rounded-full bg-red-600 shadow-[0_0_30px_#ff0000,0_0_50px_#ff0000] animate-eye" />
            </div>
            <div className="relative left-[4.8%]">
              <div className="w-6 h-6 rounded-full bg-red-600 shadow-[0_0_30px_#ff0000,0_0_50px_#ff0000] animate-eye" />
            </div>
          </div>

          {/* CONTENIDO SUPERIOR (LAYOUT CAPTURA) */}
          <div className="relative z-30 flex flex-col items-center w-full px-6 pt-16 gap-8">

            {/* Pill superior */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-black/80 px-4 py-1.5 text-[10px] text-orange-500 font-black tracking-widest uppercase shadow-[0_0_15px_rgba(255,85,0,0.2)]">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              Sistema de Evaluación 31° PROFA Activo
            </div>

            {/* Logo Central */}
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full scale-150" />
              <img
                src="/assets/logo-derecho-peru.png"
                alt="Logo Derecho Perú"
                className="h-28 w-28 md:h-36 md:w-36 object-contain rounded-full border border-white/10 shadow-[0_0_40px_rgba(255,85,0,0.6)] relative z-10"
              />
            </div>

            {/* Textos de Impacto (Captura 2 Estilo) */}
            <div className="text-center space-y-2 max-w-4xl">
              <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_8px_16px_rgba(0,0,0,1)] leading-[0.9]">
                DERECHO PERÚ
              </h1>
              <h2 className="text-2xl md:text-6xl font-black tracking-[0.2em] text-orange-500 uppercase drop-shadow-[0_4px_10px_rgba(255,85,0,0.4)]">
                PROFA SOFTWARE LEX NOVA
              </h2>
              <p className="text-sm md:text-xl text-gray-100 font-bold uppercase tracking-widest mt-4 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                Actualización inteligente para la nueva magistratura: destaca en la evaluación.
              </p>
            </div>

            {/* Botón Circular Central (Captura 2) */}
            <Link href="/login" className="mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black border-2 border-white/30 flex items-center justify-center hover:scale-110 hover:border-orange-500 transition-all duration-500 shadow-2xl group">
                <ArrowRight className="w-10 h-10 text-white transition-transform group-hover:translate-x-1" strokeWidth={3} />
              </div>
            </Link>

            {/* ── CARDS DE CARACTERISTICAS (DENTRO DE LA TARJETA ROBOT - ABAJO) ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-auto pb-8 md:pb-16 px-4">
              <div className="bg-black/60 border border-white/10 p-5 rounded-2xl backdrop-blur-md text-left flex flex-col gap-3 group hover:border-orange-500/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-600/20 p-2 rounded-lg"><Scale className="text-orange-500 w-5 h-5" /></div>
                  <h3 className="font-black text-sm uppercase tracking-wider">Simulacros Reales</h3>
                </div>
                <p className="text-[11px] text-gray-300 font-medium leading-relaxed">Exámenes cronometrados con la misma estructura y rigor que el examen oficial del JNJ.</p>
              </div>

              <div className="bg-black/60 border border-white/10 p-5 rounded-2xl backdrop-blur-md text-left flex flex-col gap-3 group hover:border-orange-500/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-600/20 p-2 rounded-lg"><BrainCircuit className="text-orange-500 w-5 h-5" /></div>
                  <h3 className="font-black text-sm uppercase tracking-wider">Análisis Predictivo</h3>
                </div>
                <p className="text-[11px] text-gray-300 font-medium leading-relaxed">Detecta tus brechas de conocimiento por categoría y genera planes de estudio automáticos.</p>
              </div>

              <div className="bg-black/60 border border-white/10 p-5 rounded-2xl backdrop-blur-md text-left flex flex-col gap-3 group hover:border-orange-500/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-600/20 p-2 rounded-lg"><BadgeCheck className="text-orange-500 w-5 h-5" /></div>
                  <h3 className="font-black text-sm uppercase tracking-wider">Antifraude</h3>
                </div>
                <p className="text-[11px] text-gray-300 font-medium leading-relaxed">Timer sincronizado con servidor y bloqueo de respuestas post-tiempo. Integridad total.</p>
              </div>
            </div>

          </div>
        </div>

        {/* ── COMUNIDAD (FUERA DE LA TARJETA) ── */}
        <div className="w-full max-w-5xl mt-12 mb-10">
          <CommunitySection />
        </div>

        {/* ── CREDITOS FINALES (DISEÑO EXACTO CAPTURA 2) ── */}
        <div className="w-full max-w-4xl text-center space-y-4 mb-20 animate-fade-in-up">
          <div className="h-[1px] w-32 bg-orange-600/30 mx-auto" />
          <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-[0.4em]">Desarrollado por:</p>
          <div className="bg-black/80 border border-white/5 px-8 py-6 rounded-2xl shadow-2xl ring-1 ring-white/10">
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest italic shrink-0">Mg. Sergio J. De la Cruz Zúñiga</h3>
            <p className="text-[9px] md:text-[10px] text-orange-500 font-black uppercase tracking-widest mt-2 leading-tight">
              ESPECIALISTA EN DERECHO PROCESAL PENAL E INTELIGENCIA ARTIFICIAL - PERITO INFORMÁTICO
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
