
"use client"

import { useState, useEffect } from "react"
import { Scale, X, ZoomIn, ZoomOut, ShieldCheck } from "lucide-react"

export function TermsModal() {
    const [open, setOpen] = useState(false);
    const [zoom, setZoom] = useState(100);

    useEffect(() => {
        const trigger = document.getElementById('terms-modal-trigger');
        const handleOpen = () => setOpen(true);

        if (trigger) {
            trigger.addEventListener('click', handleOpen);
        }
        window.addEventListener('open-terms-modal', handleOpen);

        return () => {
            if (trigger) trigger.removeEventListener('click', handleOpen);
            window.removeEventListener('open-terms-modal', handleOpen);
        }
    }, []);

    const zoomIn = () => setZoom(prev => Math.min(prev + 20, 160));
    const zoomOut = () => setZoom(prev => Math.max(prev - 20, 80));

    if (!open) return (
        // Hidden trigger backup
        <button id="terms-modal-trigger-backup" className="hidden" onClick={() => setOpen(true)} />
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-4xl h-[90vh] flex flex-col bg-black border border-primary/50 rounded-xl shadow-2xl relative overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/20 border border-primary/50">
                            <Scale className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                                TÉRMINOS DE USO
                            </h2>
                            <p className="text-primary/80 font-mono tracking-wider text-xs uppercase">
                                PROFA SOFTWARE LEX NOVA • VERSIÓN 1.0 (BETA)
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10 mr-2">
                            <button onClick={zoomOut} className="p-2 hover:bg-white/10 rounded-md transition-colors">
                                <ZoomOut className="h-4 w-4 text-gray-400" />
                            </button>
                            <span className="text-xs font-mono w-12 text-center text-gray-400">{zoom}%</span>
                            <button onClick={zoomIn} className="p-2 hover:bg-white/10 rounded-md transition-colors">
                                <ZoomIn className="h-4 w-4 text-white" />
                            </button>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="p-2 hover:bg-red-500/20 rounded-full transition-colors group"
                        >
                            <X className="h-6 w-6 text-gray-400 group-hover:text-red-400" />
                        </button>
                    </div>
                </div>

                {/* Content - Native Scroll */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                    <div
                        className="space-y-8 text-gray-300 transition-all duration-200 ease-out origin-top-left"
                        style={{ fontSize: `${zoom}%` }}
                    >
                        {/* 1. Introducción */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-primary/30 pb-2">
                                <span className="text-primary">01.</span> INTRODUCCIÓN
                            </h3>
                            <p className="leading-relaxed">
                                El presente documento regula el acceso y uso del sistema <strong>PROFA SOFTWARE LEX NOVA</strong>.
                            </p>
                            <div className="p-4 bg-orange-500/5 border-l-4 border-orange-500 rounded-r-lg">
                                <p className="text-sm">
                                    <strong>IMPORTANTE:</strong> Este software es una herramienta de preparación NO OFICIAL.
                                </p>
                            </div>
                        </section>

                        {/* 2. Responsabilidad */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-primary/30 pb-2">
                                <span className="text-primary">02.</span> LIMITACIÓN DE RESPONSABILIDAD
                            </h3>
                            <ul className="list-disc pl-5 space-y-2 marker:text-primary/70">
                                <li>Las preguntas son simulaciones académicas.</li>
                                <li>El software <strong>NO GARANTIZA</strong> el ingreso.</li>
                                <li>El autor (Mg. Sergio J. De la Cruz Zuñiga) no se hace responsable por cambios legislativos posteriores.</li>
                            </ul>
                        </section>

                        {/* 3. Propiedad Intelectual */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-primary/30 pb-2">
                                <span className="text-primary">03.</span> PROPIEDAD INTELECTUAL
                            </h3>
                            <p className="leading-relaxed">
                                Prohibida la reproducción comercial o ingeniería inversa.
                            </p>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5 shrink-0 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        <span>Aceptación obligatoria.</span>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button
                            onClick={() => setOpen(false)}
                            className="flex-1 md:flex-none px-6 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-white font-medium transition-colors"
                        >
                            CERRAR
                        </button>
                        <button
                            onClick={() => setOpen(false)}
                            className="flex-1 md:flex-none px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-black font-bold transition-colors shadow-[0_0_15px_rgba(255,85,0,0.3)]"
                        >
                            ACEPTO
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
