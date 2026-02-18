"use client";

import { CyberCard } from "@/shared/ui/CyberCard";
import { NeonButton } from "@/shared/ui/NeonButton";
import { SnowParticles } from "@/shared/ui/SnowParticles";
import { CommunitySection } from "@/shared/ui/CommunitySection";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, BrainCircuit, Scale, LogIn, ArrowRight, Power } from "lucide-react";
import { useAuth } from "@/features/login/hooks/useAuth";

const homeStyles = `
@keyframes eye-glow {
  0%, 100% { opacity: 0.5; filter: brightness(1) blur(2px); }
  50% { opacity: 1; filter: brightness(2.2) blur(5px); }
}

@keyframes content-fade {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-eye {
  animation: eye-glow 3s ease-in-out infinite;
}

.animate-fade {
  animation: content-fade 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Forzado de densidad de nieve */
.snow-container span {
  z-index: 5 !important;
}
`;

export default function Home() {
  const { logout } = useAuth();

  const handleExit = async () => {
    await logout();
    // Redirigir fuera del aplicativo (ej. a Google o página institucional)
    window.location.href = "https://www.google.com";
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black font-sans text-white flex flex-col items-center">
      <style dangerouslySetInnerHTML={{ __html: homeStyles }} />

      {/* ── 3) FONDO GLOBAL (FULL CANVAS) ── */}
      <div className="fixed inset-0 z-0 bg-[#0A0A0A] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* OVERLAY DE NIEVE ── */}
      <div className="fixed inset-0 z-10 pointer-events-none opacity-60">
        <SnowParticles />
      </div>

      {/* ── 2) CANVAS FIJO (1228x1304 px) ── */}
      <div className="relative z-20 w-[1228px] mx-auto h-[1304px] flex flex-col items-center animate-fade">

        {/* ── BOTÓN SALIR CON ICONO DESTELLANTE ── */}
        <div className="fixed top-8 right-8 z-[100] group">
          {/* Tooltip personalizado (Posicionado a la izquierda para evitar corte superior) */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className="bg-red-600 text-white text-[12px] font-black uppercase tracking-widest px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.5)] whitespace-nowrap border border-red-400/30 relative">
              Abandonar el sistema por completo
              {/* Flechita del tooltip (ahora a la derecha) */}
              <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-red-600 rotate-45 border-t border-r border-red-400/30" />
            </div>
          </div>

          <button
            onClick={handleExit}
            className="relative w-16 h-16 flex items-center justify-center rounded-full bg-red-600 text-white transition-all hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.6)] group-hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] border-2 border-red-400/40"
          >
            {/* Efecto de destello animado (Ping) */}
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40 group-hover:opacity-60" />

            {/* Resplandor interno */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-700 via-red-500 to-red-400 opacity-80" />

            {/* Icono */}
            <Power className="w-8 h-8 relative z-10 drop-shadow-lg group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        {/* ── 4) HERO CARD CENTRAL (TARJETA PRINCIPAL) ── */}
        <div className="relative w-[914px] h-[899px] mt-[59px] rounded-[32px] overflow-hidden border border-orange-500/20 shadow-[0_0_24px_rgba(255,85,0,0.25)] flex flex-col items-center">

          {/* Fondo negro base */}
          <div className="absolute inset-0 bg-black z-0" />

          {/* Overlay de circuitos (izq) y robot (der) - Capa VISIBLE sobre el fondo base */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            {/* Circuitos sutiles */}
            <div className="absolute inset-y-0 left-0 w-1/2 opacity-[0.08]">
              <Image src="/circuits.svg" alt="" fill className="object-contain object-left" />
            </div>
            {/* Robot Portada - EXACT IMAGE - object-contain para no deformar */}
            <div className="absolute inset-y-0 right-0 w-[65%] opacity-100 flex justify-end">
              <img
                src="/assets/imagen_login.png"
                alt="Robot Sentinel"
                className="h-full w-full object-contain object-right"
              />
              {/* Degradados laterales suaves para fundir con el negro sin tapar al robot */}
              <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
            </div>
          </div>

          <div className="relative z-20 w-full h-full flex flex-col items-center">
            {/* ── 5) ELEMENTOS SUPERIORES ── */}
            <div className="pt-8 flex flex-col items-center gap-6 w-full">
              {/* 5.1 Capsula */}
              <div className="px-6 py-2 rounded-full border border-orange-500/30 bg-black/80 text-orange-500 text-[12px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(255,85,0,0.1)]">
                Sistema de Evaluación 31° PROFA Activo
              </div>

              {/* 5.2 Logotipo circular */}
              <div className="relative w-[100px] h-[100px]">
                <div className="absolute inset-0 bg-orange-600/40 blur-2xl rounded-full scale-110" />
                <img
                  src="/assets/logo-derecho-peru.png"
                  alt="Logo"
                  className="w-full h-full object-contain relative z-10 rounded-full border border-white/10"
                />
              </div>
            </div>

            {/* 6) Títulos */}
            <div className="mt-6 text-center space-y-0 px-4">
              <h1 className="text-[100px] font-black italic text-white uppercase leading-[0.85] drop-shadow-[0_12px_24px_rgba(0,0,0,1)] tracking-tighter">
                DERECHO PERÚ
              </h1>
              <h2 className="text-[40px] font-black tracking-[0.3em] text-orange-600 uppercase drop-shadow-[0_4px_12px_rgba(255,85,0,0.5)] mt-1">
                PROFA SOFTWARE LEX NOVA
              </h2>
              <p className="text-[16px] text-gray-300 font-medium max-w-2xl mx-auto tracking-wide mt-6">
                Actualización inteligente para la nueva magistratura: destaca en la evaluación.
              </p>
            </div>

            {/* 7) CTA Button */}
            <div className="mt-6 mb-6">
              <Link href="/login">
                <div className="w-[75px] h-[75px] rounded-full bg-black border-2 border-orange-500 flex items-center justify-center shadow-[0_0_40px_rgba(255,85,0,0.4)] transition-all hover:scale-110 group cursor-pointer relative">
                  <div className="absolute inset-0 rounded-full bg-orange-600/10 blur-xl group-hover:bg-orange-600/20" />
                  <ArrowRight className="w-10 h-10 text-white transition-transform group-hover:translate-x-1 relative z-10" strokeWidth={3} />
                </div>
              </Link>
            </div>

            {/* ── 8) TRES CARDS DE CARACTERÍSTICAS (DENTRO DEL HERO, PARTE INFERIOR) ── */}
            <div className="mt-auto w-full grid grid-cols-3 gap-4 px-6 pb-10 z-20">
              {/* Card 1 */}
              <div className="bg-black/70 backdrop-blur-xl border border-orange-500/20 p-5 rounded-2xl hover:border-orange-500/40 transition-all shadow-2xl">
                <Scale className="text-orange-500 w-6 h-6 mb-2" />
                <h3 className="font-bold text-xs text-white uppercase tracking-wider mb-2">Simulacros Reales</h3>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Exámenes cronometrados con la misma estructura y rigor que el examen oficial del JNJ.</p>
              </div>

              {/* Card 2 */}
              <div className="bg-black/70 backdrop-blur-xl border border-orange-500/20 p-5 rounded-2xl hover:border-orange-500/40 transition-all shadow-2xl">
                <BrainCircuit className="text-orange-500 w-6 h-6 mb-2" />
                <h3 className="font-bold text-xs text-white uppercase tracking-wider mb-2">Análisis Predictivo</h3>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Detecta tus brechas de conocimiento por categoría y genera planes de estudio automáticos.</p>
              </div>

              {/* Card 3 */}
              <div className="bg-black/70 backdrop-blur-xl border border-orange-500/20 p-5 rounded-2xl hover:border-orange-500/40 transition-all shadow-2xl">
                <BadgeCheck className="text-orange-500 w-6 h-6 mb-2" />
                <h3 className="font-bold text-xs text-white uppercase tracking-wider mb-2">Antifraude</h3>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Timer sincronizado con servidor y bloqueo de respuestas post-tiempo. Integridad total.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 9) PANEL INFERIOR (FUERA DEL HERO) ── */}
        <div className="w-[914px] mt-10 mb-12">
          <CommunitySection className="rounded-[32px] border-orange-500/20 bg-black/60 shadow-[0_0_20px_rgba(255,85,0,0.15)]" />
        </div>

        {/* ── 10) CRÉDITOS FINALES (PARTE BAJA) ── */}
        <div className="text-center space-y-2 mb-20 px-4">
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.4em]">Desarrollado por:</p>
          <div className="flex flex-col gap-1">
            <h4 className="text-2xl font-bold text-white tracking-widest">Mg. Sergio J. De la Cruz Zúñiga</h4>
            <p className="text-[10px] md:text-sm text-orange-600 font-black uppercase tracking-[0.2em] max-w-4xl mx-auto">
              ESPECIALISTA EN DERECHO PROCESAL PENAL E INTELIGENCIA ARTIFICIAL - PERITO INFORMÁTICO
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
