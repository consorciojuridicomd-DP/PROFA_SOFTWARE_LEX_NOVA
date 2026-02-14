import { Scale, BrainCircuit, BadgeCheck } from "lucide-react";
import { CyberCard } from "@/shared/ui/CyberCard";
import { SnowParticles } from "@/shared/ui/SnowParticles";
import { CommunitySection } from "@/shared/ui/CommunitySection";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-x-hidden text-white font-sans">

            {/* ══════════════════════════════════════════════════
                A) BACKGROUND LAYERS
                ══════════════════════════════════════════════════ */}

            {/* 4. Circuit Overlay (Hex Tech) */}
            <div className="fixed inset-0 -z-20 bg-[url('/grid.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

            {/* 5. Snow/Ash (Under UI) */}
            <div className="fixed inset-0 -z-10 pointer-events-none opacity-80">
                <SnowParticles />
            </div>

            {/* ══════════════════════════════════════════════════
                B) CENTRAL STACK (UI CONTENT)
                ══════════════════════════════════════════════════ */}
            <div className="w-full max-w-[980px] p-8 md:p-12 flex flex-col items-center text-center gap-8 relative z-10 my-10 rounded-3xl ring-1 ring-white/10 shadow-2xl overflow-hidden bg-black/20 backdrop-blur-sm">

                {/* ── INTERNAL BACKGROUNDS (Robot inside the window) ── */}

                {/* 1. Robot Image */}
                <div
                    className="absolute inset-0 -z-20"
                    style={{
                        backgroundImage: "url('/assets/image.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        opacity: 0.9
                    }}
                />

                {/* 2. Gradient Overlay (Legibility) */}
                <div
                    className="absolute inset-0 -z-10"
                    style={{
                        background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.8) 100%)"
                    }}
                />

                {/* 3. Scrim */}
                <div className="absolute inset-0 -z-10 bg-black/30" />

                {/* ── E) LOGO ── */}
                <img
                    src="/assets/logo-derecho-peru.png"
                    alt="Logo Derecho Perú"
                    className="h-[72px] md:h-[90px] object-contain mb-2 drop-shadow-[0_0_25px_rgba(255,85,0,0.5)]"
                />

                {/* ── F) TEXTOS EXACTOS ── */}
                <div className="space-y-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-xl">
                        DERECHO PERÚ
                    </h1>
                    <h2 className="text-xl md:text-3xl font-bold text-primary tracking-wide" style={{ textShadow: "0 0 15px rgba(255,85,0,0.4)" }}>
                        PROFA SOFTWARE LexNova
                    </h2>
                    <p className="text-sm md:text-lg text-gray-200 opacity-90 leading-relaxed font-medium drop-shadow-md max-w-2xl mx-auto">
                        Actualización inteligente para la nueva magistratura: destaca en la evaluación
                    </p>
                </div>

                {/* ── G) FORMULARIO ── */}
                <div className="w-full max-w-[560px] mx-auto [&_div]:!bg-black/40 [&_div]:!backdrop-blur-md [&_div]:!border-primary/30">
                    {children}
                </div>

                {/* Botones eliminados — el formulario ya tiene su propio botón de submit */}

                {/* ── I) 3 CARDS (FEATURES) ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8 text-left">
                    <CyberCard
                        title="Simulacros Reales"
                        icon={<Scale className="h-6 w-6" />}
                        className="bg-black/60 backdrop-blur-md border-primary/30"
                    >
                        <p className="text-sm text-gray-300">
                            Exámenes cronometrados con la misma estructura y rigor que el examen oficial del JNJ.
                        </p>
                    </CyberCard>

                    <CyberCard
                        title="Análisis Predictivo"
                        icon={<BrainCircuit className="h-6 w-6" />}
                        className="bg-black/60 backdrop-blur-md border-primary/30"
                    >
                        <p className="text-sm text-gray-300">
                            Detecta tus brechas de conocimiento por categoría y genera planes de estudio.
                        </p>
                    </CyberCard>

                    <CyberCard
                        title="Antifraude"
                        icon={<BadgeCheck className="h-6 w-6" />}
                        className="bg-black/60 backdrop-blur-md border-primary/30"
                    >
                        <p className="text-sm text-gray-300">
                            Timer sincronizado con servidor y bloqueo de respuestas post-tiempo. Integridad total.
                        </p>
                    </CyberCard>
                </div>

                {/* ── J) COMUNIDAD ── */}
                <div className="w-full pt-6">
                    <CommunitySection className="bg-black/40 border-primary/20 backdrop-blur-md" />
                </div>



            </div>
        </div>
    );
}
