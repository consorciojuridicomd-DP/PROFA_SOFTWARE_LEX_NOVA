import { CyberCard } from "@/shared/ui/CyberCard";
import { NeonButton } from "@/shared/ui/NeonButton";
import { SnowParticles } from "@/shared/ui/SnowParticles";
import { CommunitySection } from "@/shared/ui/CommunitySection";
import Link from "next/link";
import { BadgeCheck, BrainCircuit, Scale } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 md:px-8 md:py-12">

        {/* ── Central Card (Robot Container) ── */}
        <div
          className="w-full max-w-5xl flex flex-col items-center text-center gap-6 md:gap-10 rounded-3xl px-6 py-10 md:px-14 md:py-16 relative overflow-hidden ring-1 ring-white/10 shadow-2xl"
        >
          {/* 1. Robot Background (Inside Content Box) */}
          <div
            className="absolute inset-0 -z-20"
            style={{
              backgroundImage: "url('/assets/login-robot-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
              opacity: 1,
              filter: "brightness(1.1) contrast(1.1) saturate(1.1)"
            }}
          />

          {/* 2. Dark Scrim (Inside Content Box) - to ensure text legibility */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />

          {/* 3. Snow Effects (Inside Content Box - falling on robot) */}
          <div className="absolute inset-0 -z-0 opacity-80 mix-blend-screen pointer-events-none">
            <SnowParticles />
          </div>

          {/* ── Content (z-10) ── */}
          <div className="relative z-10 w-full flex flex-col items-center gap-6 md:gap-10">

            {/* ── Badge pill ── */}
            <div
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-black/40 backdrop-blur-md px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm text-primary shadow-[0_0_15px_rgba(255,85,0,0.3)]"
              style={{ animation: "pulse-ring 2.5s ease-in-out infinite" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Sistema de Evaluación 31° PROFA Activo
            </div>

            {/* ── Logo ── */}
            <img
              src="/assets/logo-derecho-peru.png"
              alt="Derecho Perú Logo"
              className="h-24 w-24 md:h-32 md:w-32 object-contain rounded-full drop-shadow-[0_0_25px_rgba(255,85,0,0.6)]"
              style={{
                animation: "float-glow 4s ease-in-out infinite",
              }}
            />

            {/* ── Title Block ── */}
            <div className="space-y-4">
              <h1
                className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight"
                style={{
                  color: "#FFFFFF",
                  textShadow: "0 4px 30px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)",
                }}
              >
                DERECHO PERÚ
              </h1>

              <h2
                className="text-xl sm:text-3xl md:text-4xl font-bold tracking-wide break-words max-w-full"
                style={{
                  color: "#FF5500",
                  textShadow: "0 0 15px rgba(255,85,0,0.4), 0 2px 5px rgba(0,0,0,1)",
                  WebkitTextStroke: "0.5px rgba(255,255,255,0.1)",
                }}
              >
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
              <Link href="/auth/login" className="w-full sm:w-auto">
                <NeonButton size="lg" className="w-full sm:w-48 text-base md:text-lg font-bold tracking-wider uppercase shadow-lg shadow-primary/20">
                  Ingresar
                </NeonButton>
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

        {/* ── Footer / Credits Section (Restored) ── */}
        <div className="mt-12 w-full max-w-4xl text-center space-y-8 relative z-20">

          {/* Social & Contact Buttons */}
          <CommunitySection className="bg-black/40 border-primary/20 backdrop-blur-md" />

          {/* Creator Credit */}
          <div className="space-y-2">
            <p className="text-sm md:text-base text-muted-foreground font-medium">
              Desarrollado por:
            </p>
            <div className="inline-block p-4 rounded-xl bg-black/50 border border-primary/10 backdrop-blur-sm">
              <p className="text-base md:text-lg text-white font-bold tracking-wide">
                Mg. Sergio J. De la Cruz Zúñiga
              </p>
              <p className="text-xs md:text-sm text-primary/90 mt-1 uppercase tracking-wider">
                Especialista en Derecho Procesal Penal e Inteligencia Artificial - Perito Informático
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/50">
            © 2026 Derecho Perú. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </main>
  );
}
