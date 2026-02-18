"use client";

import { CyberCard } from "@/shared/ui/CyberCard";
import { NeonButton } from "@/shared/ui/NeonButton";
import { SnowParticles } from "@/shared/ui/SnowParticles";
import { CommunitySection } from "@/shared/ui/CommunitySection";
import Link from "next/link";
import { BadgeCheck, BrainCircuit, Scale, LogIn } from "lucide-react";
import { useAuth } from "@/features/login/hooks/useAuth";

const homeStyles = `
@keyframes eye-glow {
  0%, 100% { opacity: 0.6; filter: brightness(1) blur(2px); transform: scale(1); }
  50% { opacity: 1; filter: brightness(1.8) blur(4px); transform: scale(1.15); }
}

@keyframes robot-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-eye {
  animation: eye-glow 3s ease-in-out infinite;
}

.animate-robot-bg {
  animation: robot-float 10s ease-in-out infinite;
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

      {/* FONDO DE PARTICULAS */}
      <div className="fixed inset-0 -z-20 pointer-events-none opacity-30">
        <SnowParticles />
      </div>

      {/* BOTON SALIR (REQUISITO FUNCIONAL) */}
      <div className="fixed top-6 right-6 z-[100]">
        <button
          onClick={handleExit}
          className="group flex items-center gap-3 bg-red-600/10 hover:bg-red-600/20 border-2 border-red-600/30 hover:border-red-600 px-6 py-2 rounded-full transition-all duration-300"
        >
          <span className="text-[10px] font-black tracking-widest uppercase text-red-500">Cerrar Sistema</span>
          <LogIn className="w-4 h-4 text-red-500 rotate-180" />
        </button>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center px-4 py-8 md:px-8 mt-10">

        {/* ── CONTENEDOR CENTRAL (DISEÑO ORIGINAL) ── */}
        <div className="w-full max-w-6xl flex flex-col items-center text-center gap-8 md:gap-12 rounded-3xl p-6 md:p-16 relative overflow-hidden bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl">

          {/* IMAGEN DEL ROBOT (VISIBLE Y ESCALADA) */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <img
              src="/assets/robot-portada.jpg"
              alt="Robot Background"
              className="w-full h-full object-cover object-center opacity-70 animate-robot-bg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
          </div>

          {/* BRILLO DE OJOS (ÚNICO EFECTO SOLICITADO) */}
          <div className="absolute inset-x-0 top-[37%] z-[5] flex justify-center gap-14 pointer-events-none">
            <div className="relative left-[-3%]">
              <div className="w-5 h-5 rounded-full bg-red-600 shadow-[0_0_25px_#ff0000,0_0_45px_#ff0000] animate-eye" />
            </div>
            <div className="relative left-[5%]">
              <div className="w-5 h-5 rounded-full bg-red-600 shadow-[0_0_25px_#ff0000,0_0_45px_#ff0000] animate-eye" />
            </div>
          </div>

          <div className="relative z-20 flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-black/60 px-4 py-1.5 text-[10px] text-orange-500 font-bold tracking-widest uppercase">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Sistema de Evaluación 31° PROFA Activo
            </div>

            <div className="relative">
              <img
                src="/assets/logo-derecho-peru.png"
                alt="Derecho Perú"
                className="h-24 w-24 md:h-32 md:w-32 object-contain rounded-full shadow-[0_0_30px_rgba(255,85,0,0.5)] border border-white/10"
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                DERECHO PERÚ
              </h1>
              <h2 className="text-xl sm:text-3xl md:text-5xl font-black tracking-[0.2em] text-orange-500 uppercase">
                PROFA SOFTWARE LEX NOVA
              </h2>
            </div>

            <p className="max-w-xl text-sm md:text-lg text-gray-200 font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              Actualización inteligente para la nueva magistratura: destaca en la evaluación.
            </p>

            <Link href="/login" className="mt-4 transition-transform hover:scale-110">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black border-2 border-white/20 flex items-center justify-center hover:border-orange-500 shadow-xl">
                <LogIn className="w-8 h-8 text-white" />
              </div>
            </Link>
          </div>
        </div>

        {/* ── CARDS DE CARACTERISTICAS (LAYOUT ORIGINAL) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-12">
          <CyberCard
            title="Simulacros Reales"
            description="Exámenes cronometrados con la misma estructura y rigor que el examen oficial del JNJ."
            icon={<Scale className="text-orange-500 w-6 h-6" />}
          />
          <CyberCard
            title="Análisis Predictivo"
            description="Detecta tus brechas de conocimiento por categoría y genera planes de estudio automáticos."
            icon={<BrainCircuit className="text-orange-500 w-6 h-6" />}
          />
          <CyberCard
            title="Antifraude"
            description="Timer sincronizado con servidor y bloqueo de respuestas post-tiempo. Integridad total."
            icon={<BadgeCheck className="text-orange-500 w-6 h-6" />}
          />
        </div>

        <div className="mt-16 w-full max-w-6xl">
          <CommunitySection />
        </div>

        {/* ── CREDITOS FINALES (DISEÑO DE IMAGEN 2) ── */}
        <div className="mt-16 mb-20 text-center space-y-2">
          <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-[0.3em]">Desarrollado por:</p>
          <h3 className="text-base md:text-lg font-black text-white uppercase tracking-widest">Mg. Sergio J. De la Cruz Zúñiga</h3>
          <p className="text-[9px] md:text-[10px] text-orange-600 font-black uppercase tracking-tighter leading-tight max-w-lg mx-auto">
            ESPECIALISTA EN DERECHO PROCESAL PENAL E INTELIGENCIA ARTIFICIAL - PERITO INFORMÁTICO
          </p>
        </div>

      </div>
    </main>
  );
}
