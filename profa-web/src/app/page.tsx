"use client";

import { CyberCard } from "@/shared/ui/CyberCard";
import { NeonButton } from "@/shared/ui/NeonButton";
import { SnowParticles } from "@/shared/ui/SnowParticles";
import { CommunitySection } from "@/shared/ui/CommunitySection";
import Link from "next/link";
import { BadgeCheck, BrainCircuit, Scale, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/features/login/hooks/useAuth";

const homeStyles = `
@keyframes eye-glow {
  0%, 100% { opacity: 0.6; filter: brightness(1) blur(2px); }
  50% { opacity: 1; filter: brightness(2) blur(5px); }
}

@keyframes robot-breathing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-eye {
  animation: eye-glow 3s ease-in-out infinite;
}

.animate-robot {
  animation: robot-breathing 8s ease-in-out infinite;
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

      {/* Partículas de fondo */}
      <div className="fixed inset-0 -z-30 pointer-events-none opacity-20">
        <SnowParticles />
      </div>

      {/* Botón Salir */}
      <div className="fixed top-6 right-6 z-[100]">
        <button
          onClick={handleExit}
          className="group flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 border-2 border-red-600/30 hover:border-red-600 px-4 py-2 rounded-full transition-all text-red-500"
        >
          <span className="text-[10px] font-black tracking-widest uppercase">Cerrar Sistema</span>
          <LogIn className="w-4 h-4 rotate-180" />
        </button>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center px-4 py-10 md:px-8">

        {/* ── CARD PRINCIPAL (MATCH CAPTURA 2) ── */}
        <div className="w-full max-w-5xl rounded-[32px] overflow-hidden relative border border-white/10 shadow-2xl bg-[#0a0a0a] flex flex-col items-center min-h-[80vh] animate-robot">

          {/* IMAGEN DEL ROBOT COMO FONDO (FIJA Y VISIBLE) */}
          <div className="absolute inset-0 -z-10">
            <img
              src="/assets/robot-portada.jpg"
              alt="Robot"
              className="w-full h-full object-cover object-top opacity-100"
            />
            {/* Overlay para legibilidad conservando el estilo de la captura */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
          </div>

          {/* Brillo de ojos (Posición absoluta sobre el robot) */}
          <div className="absolute inset-x-0 top-[37.8%] z-20 flex justify-center gap-14 pointer-events-none">
            <div className="relative left-[-2.8%]">
              <div className="w-6 h-6 rounded-full bg-red-600 shadow-[0_0_30px_#ff0000,0_0_50px_#ff0000] animate-eye" />
            </div>
            <div className="relative left-[4.8%]">
              <div className="w-6 h-6 rounded-full bg-red-600 shadow-[0_0_30px_#ff0000,0_0_50px_#ff0000] animate-eye" />
            </div>
          </div>

          {/* Contenido Superior */}
          <div className="relative z-30 flex flex-col items-center w-full pt-12 gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/50 bg-black/80 px-4 py-1 text-[10px] text-orange-500 font-bold tracking-widest uppercase">
              <span className="h-2 w-2 rounded-full bg-orange-600" />
              Sistema de Evaluación 31° PROFA Activo
            </div>

            <div className="relative mt-2">
              <img
                src="/assets/logo-derecho-peru.png"
                alt="Logo"
                className="h-28 w-28 md:h-32 md:w-32 object-contain rounded-full shadow-[0_0_30px_rgba(255,85,0,0.4)]"
              />
            </div>

            <div className="text-center space-y-2 px-4 mt-4">
              <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_8px_16px_rgba(0,0,0,1)] leading-none">
                DERECHO PERÚ
              </h1>
              <h2 className="text-2xl md:text-6xl font-black tracking-widest text-orange-600 uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                PROFA SOFTWARE LEX NOVA
              </h2>
              <p className="text-xs md:text-lg text-white font-bold tracking-wide mt-4 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                Actualización inteligente para la nueva magistratura: destaca en la evaluación.
              </p>
            </div>

            <Link href="/login" className="my-6">
              <div className="w-20 h-20 rounded-full bg-black border-2 border-white/20 flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
                <div className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-[16px] border-l-white ml-1" />
                </div>
              </div>
            </Link>

            {/* Features internas (Match Captura 2) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl px-4 mt-auto pb-10">
              <div className="bg-black/60 border border-white/10 p-4 rounded-xl backdrop-blur-md">
                <div className="flex items-center gap-3 mb-2">
                  <Scale className="text-orange-600 w-5 h-5" />
                  <span className="font-black text-xs uppercase tracking-wider">Simulacros Reales</span>
                </div>
                <p className="text-[10px] text-gray-300 leading-tight">Exámenes cronometrados con la misma estructura y rigor que el examen oficial del JNJ.</p>
              </div>
              <div className="bg-black/60 border border-white/10 p-4 rounded-xl backdrop-blur-md">
                <div className="flex items-center gap-3 mb-2">
                  <BrainCircuit className="text-orange-600 w-5 h-5" />
                  <span className="font-black text-xs uppercase tracking-wider">Análisis Predictivo</span>
                </div>
                <p className="text-[10px] text-gray-300 leading-tight">Detecta tus brechas de conocimiento por categoría y genera planes de estudio automáticos.</p>
              </div>
              <div className="bg-black/60 border border-white/10 p-4 rounded-xl backdrop-blur-md">
                <div className="flex items-center gap-3 mb-2">
                  <BadgeCheck className="text-orange-600 w-5 h-5" />
                  <span className="font-black text-xs uppercase tracking-wider">Antifraude</span>
                </div>
                <p className="text-[10px] text-gray-300 leading-tight">Timer sincronizado con servidor y bloqueo de respuestas post-tiempo. Integridad total.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comunidad */}
        <div className="w-full max-w-5xl mt-10">
          <CommunitySection />
        </div>

        {/* CRÉDITOS FINALES (MATCH CAPTURA 2) */}
        <div className="w-full max-w-4xl text-center space-y-4 mt-16 mb-20 text-white">
          <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-[0.3em]">Desarrollado por:</p>
          <div className="bg-black/80 border border-white/10 p-8 rounded-2xl shadow-2xl">
            <h3 className="text-xl md:text-3xl font-black uppercase tracking-widest italic shrink-0">Mg. Sergio J. De la Cruz Zúñiga</h3>
            <p className="text-[10px] md:text-xs text-orange-600 font-black uppercase tracking-widest mt-2">
              ESPECIALISTA EN DERECHO PROCESAL PENAL E INTELIGENCIA ARTIFICIAL - PERITO INFORMÁTICO
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
