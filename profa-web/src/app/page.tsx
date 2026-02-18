"use client";

const homeStyles = `
@keyframes soft-pulse {
  /* FORCE DEPLOY: 2026-02-17 23:32 - IMPACTO TOTAL */
  0%, 100% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 20px rgba(255, 85, 0, 0.4));
}
50% { transform: scale(1.05); filter: brightness(1.3) drop-shadow(0 0 50px rgba(255, 85, 0, 0.7)); }
}

@keyframes laser-beam {
  0% { transform: scaleX(0); opacity: 0; }
  50% { transform: scaleX(1); opacity: 1; filter: blur(2px); }
  100% { transform: scaleX(0); opacity: 0; }
}

@keyframes logo-explosion {
  0% { transform: scale(0.5); opacity: 0; filter: brightness(2) blur(20px); }
  50% { transform: scale(1.2); opacity: 0.8; filter: brightness(3) blur(10px); }
  100% { transform: scale(1); opacity: 1; filter: brightness(1) blur(0px); }
}

@keyframes robot-breathing {
  0%, 100% { transform: translateY(0) scale(1.01); }
  50% { transform: translateY(-10px) scale(1.03); }
}

@keyframes eye-blink-red {
  0%, 100% { opacity: 1; transform: scale(1); filter: blur(0px); box-shadow: 0 0 20px #ff0000;
}
50% { opacity: 0.5; transform: scale(1.2); filter: blur(4px); box-shadow: 0 0 40px #ff0000; }
}

.animate-laser {
  animation: laser-beam 2s ease-in-out infinite;
  transform-origin: center;
}

.animate-explosion {
  animation: logo-explosion 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-soft-pulse {
  animation: soft-pulse 4s ease-in-out infinite;
}

.animate-robot {
  animation: robot-breathing 8s ease-in-out infinite;
}

.animate-eye-blink {
  animation: eye-blink-red 3s ease-in-out infinite;
}
`;

import { CyberCard } from "@/shared/ui/CyberCard";
import { NeonButton } from "@/shared/ui/NeonButton";
import { SnowParticles } from "@/shared/ui/SnowParticles";
import { CommunitySection } from "@/shared/ui/CommunitySection";
import Link from "next/link";
import { BadgeCheck, BrainCircuit, Scale, LogIn } from "lucide-react";
import { useAuth } from "@/features/login/hooks/useAuth";

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

      {/* ── Fixed Exit Button (Top Right) ── */}
      <div className="fixed top-6 right-6 z-[100]">
        <button
          onClick={handleExit}
          className="group flex items-center gap-3 bg-red-600/10 hover:bg-red-600/20 border-2 border-red-600/30 hover:border-red-600 px-6 py-3 rounded-full transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] active:scale-95 shadow-[0_0_20px_rgba(255,0,0,0.2)]"
          title="SALIR TOTALMENTE DEL SISTEMA"
        >
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-500 group-hover:text-red-400">Cerrar Sistema</span>
          <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center group-hover:bg-red-600 transition-colors">
            <LogIn className="w-4 h-4 text-red-500 group-hover:text-white rotate-180" />
          </div>
        </button>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 py-8 md:px-8">

        {/* ── Central Card (Robot Container) ── */}
        <div
          className="w-full max-w-5xl flex flex-col items-center text-center gap-6 md:gap-10 rounded-3xl px-6 py-10 md:px-14 md:py-16 relative overflow-hidden ring-1 ring-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-black/40 backdrop-blur-xl animate-robot"
        >
          {/* 1. Robot Background (FORZADO AL FRENTE DEL CONTAINER) */}
          <div
            className="absolute inset-0 bg-[url('/assets/login-robot-bg.png')] bg-cover bg-center z-0"
            style={{
              opacity: 1,
              filter: "brightness(1.5) contrast(1.2) saturate(1.5)",
            }}
          />

          {/* Capa de oscurecimiento interna para legibilidad del texto */}
          <div className="absolute inset-0 bg-black/40 z-[1]" />

          {/* 1. Eye Glow Effects - RED LASERS (FRENTE) */}
          <div className="absolute inset-x-0 top-[38%] z-[2] flex justify-center gap-14 pointer-events-none">
            <div className="relative left-[-3%] flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-red-600 shadow-[0_0_30px_#ff0000] animate-eye-blink" />
              <div className="absolute top-[50%] h-[2px] w-[200px] bg-gradient-to-r from-red-600 to-transparent animate-laser opacity-50 blur-[1px]" />
            </div>
            <div className="relative left-[5%] flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-red-600 shadow-[0_0_30px_#ff0000] animate-eye-blink" />
              <div className="absolute top-[50%] h-[2px] w-[200px] bg-gradient-to-l from-red-600 to-transparent animate-laser opacity-50 blur-[1px]" />
            </div>
          </div>

          {/* ── Content (z-10) ── */}
          <div className="relative z-10 w-full flex flex-col items-center gap-6 md:gap-10">

            {/* ── Badge pill ── */}
            <div
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-black/40 backdrop-blur-md px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm text-primary shadow-[0_0_15px_rgba(255,85,0,0.3)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Sistema de Evaluación 31° PROFA Activo
            </div>

            {/* ── Logo with explosion ── */}
            <div className="relative group animate-explosion">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/40 transition-all duration-700 animate-pulse"></div>
              <img
                src="/assets/logo-derecho-peru.png"
                alt="Derecho Perú Logo"
                className="h-28 w-28 md:h-36 md:w-36 object-contain rounded-full drop-shadow-[0_0_40px_rgba(255,85,0,1)] transition-transform duration-500 group-hover:scale-125 relative z-10"
              />
              {/* Explosion rings */}
              <div className="absolute inset-0 border-2 border-primary/50 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
            </div>

            {/* ── Title Block ── */}
            <div className="space-y-4 px-2">
              <h1 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none text-white drop-shadow-[0_5px_15px_rgba(0,0,0,1)] uppercase italic animate-in slide-in-from-top-10 duration-1000">
                DERECHO PERÚ
              </h1>
              <h2 className="text-xl sm:text-4xl md:text-5xl font-extrabold tracking-widest text-primary drop-shadow-[0_0_30px_rgba(255,85,0,0.8)] uppercase animate-in slide-in-from-bottom-10 duration-1000">
                PROFA SOFTWARE Lex NOVA
              </h2>
            </div>

            {/* ── Description ── */}
            <p
              className="text-sm sm:text-base md:text-lg max-w-[95%] md:max-w-[70%] leading-relaxed mx-auto font-medium"
              style={{
                color: "#E5E5E5",
                textShadow: "0 2px 4px rgba(0,0,0,0.9)",
              }}
            >
              Actualización inteligente para la nueva magistratura: destaca en la evaluación.
            </p>

            {/* ── Buttons ── */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 pt-4 w-full sm:w-auto">
              <Link href="/login" className="w-full sm:w-auto flex flex-col items-center">
                <button
                  className="group relative w-24 h-24 rounded-full bg-gradient-to-br from-[#FF3300] to-[#990000] p-[2px] shadow-[0_0_30px_rgba(255,51,0,0.5)] hover:shadow-[0_0_60px_rgba(255,51,0,0.7)] transition-all duration-500 hover:scale-110 active:scale-95 flex items-center justify-center overflow-visible"
                >
                  <div className="absolute inset-0 rounded-full blur-[15px] bg-[#FF3300]/40 group-hover:blur-[25px] transition-all animate-pulse"></div>
                  <div className="relative w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-[#FF3300]/50">
                    <LogIn className="w-10 h-10 text-white group-hover:scale-125 transition-transform duration-500" />
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                  </div>

                  {/* Tooltip Cyber */}
                  <span className="absolute -bottom-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] font-black text-white uppercase tracking-[0.4em] whitespace-nowrap bg-black/90 px-6 py-2 rounded-full border border-[#FF3300]/50 shadow-[0_0_20px_rgba(255,51,0,0.3)] backdrop-blur-md">
                    Ingresar al Sistema
                  </span>
                </button>
              </Link>
            </div>

            <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-8 text-left w-full scroll-mt-24">
              <CyberCard
                title="Simulacros Reales"
                icon={<Scale className="h-6 w-6" />}
                className="bg-black/60 backdrop-blur-md border-primary/30 hover:border-primary/60 transition-colors"
              >
                <p className="text-sm text-gray-300">
                  Exámenes cronometrados con la misma estructura y rigor que el examen oficial del JNJ.
                </p>
              </CyberCard>

              <CyberCard
                title="Análisis Predictivo"
                icon={<BrainCircuit className="h-6 w-6" />}
                className="bg-black/60 backdrop-blur-md border-primary/30 hover:border-primary/60 transition-colors"
              >
                <p className="text-sm text-gray-300">
                  Detecta tus brechas de conocimiento por categoría y genera planes de estudio automáticos.
                </p>
              </CyberCard>

              <CyberCard
                title="Antifraude"
                icon={<BadgeCheck className="h-6 w-6" />}
                className="bg-black/60 backdrop-blur-md border-primary/30 hover:border-primary/60 transition-colors"
              >
                <p className="text-sm text-gray-300">
                  Timer sincronizado con servidor y bloqueo de respuestas post-tiempo. Integridad total.
                </p>
              </CyberCard>
            </div>
          </div>
        </div>

        {/* ── Footer / Credits ── */}
        <div className="mt-12 w-full max-w-4xl text-center space-y-8 relative z-20">
          <CommunitySection className="bg-black/40 border-primary/20 backdrop-blur-md" />
          <div className="space-y-2">
            <p className="text-sm md:text-base text-muted-foreground font-medium">Desarrollado por:</p>
            <div className="inline-block p-4 rounded-xl bg-black/50 border border-primary/10 backdrop-blur-sm">
              <p className="text-base md:text-lg text-white font-bold tracking-wide">Mg. Sergio J. De la Cruz Zúñiga</p>
              <p className="text-xs md:text-sm text-primary/90 mt-1 uppercase tracking-wider">Especialista en Derecho Procesal Penal e Inteligencia Artificial - Perito Informático</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
