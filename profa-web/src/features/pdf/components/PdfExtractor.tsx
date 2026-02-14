"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { CyberCard } from "@/shared/ui/CyberCard"
import { NeonButton } from "@/shared/ui/NeonButton"
import { Upload, Loader2, CheckCircle, AlertTriangle, BrainCircuit, Play } from "lucide-react"

interface ExtractedPage {
    page: number;
    text: string;
    requiresOcr?: boolean;
}

interface ExtractionResult {
    fileName: string;
    pages: ExtractedPage[];
    fullText: string;
    extractedAt: string;
}

export function PdfExtractor() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ExtractionResult | null>(null);
    const [progress, setProgress] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Por favor sube un archivo PDF válido.");
            return;
        }

        setLoading(true);
        setProgress("Iniciando lectura...");
        setResult(null);

        try {
            // Dynamic import to avoid SSG/Node build issues
            const pdfjsLib = await import("pdfjs-dist");

            // Set worker using unpkg (more reliable for specific versions)
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

            const totalPages = pdf.numPages;
            const pages: ExtractedPage[] = [];
            let fullText = "";

            for (let i = 1; i <= totalPages; i++) {
                setProgress(`Procesando página ${i} de ${totalPages}...`);
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");

                const requiresOcr = pageText.trim().length < 50;

                pages.push({ page: i, text: pageText, requiresOcr });
                fullText += pageText + "\n\n";
            }

            const extraction: ExtractionResult = {
                fileName: file.name,
                pages,
                fullText,
                extractedAt: new Date().toISOString()
            };

            setResult(extraction);
            setProgress("¡Análisis completado!");
        } catch (err: any) {
            console.error(err);
            setProgress(`Error al procesar el PDF: ${err.message || "Error desconocido"}`);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateQuiz = () => {
        if (!result) return;

        // Simple keyword analysis to detect topic
        const text = result.fullText.toLowerCase();
        let detectedTopic = "Derecho Penal"; // Default fallback

        const keywords: Record<string, string> = {
            "civil": "Derecho Civil",
            "contrato": "Derecho Civil",
            "familia": "Derecho Civil",
            "administrativo": "Derecho Administrativo",
            "administracion": "Derecho Administrativo",
            "constitucional": "Derecho Constitucional",
            "amparo": "Derecho Constitucional",
            "laboral": "Derecho Laboral",
            "trabajo": "Derecho Laboral",
            "minero": "Derecho Minero",
            "penal": "Derecho Penal",
            "delito": "Derecho Penal",
            "procesal civil": "Procesal Civil",
            "demanda": "Procesal Civil"
        };

        // Find the most frequent keyword match
        // For simplicity, just find the first match
        for (const [key, topic] of Object.entries(keywords)) {
            if (text.includes(key)) {
                detectedTopic = topic;
                break;
            }
        }

        // Redirect to exam select with the detected topic
        router.push(`/app/select?topic=${encodeURIComponent(detectedTopic)}&source=pdf_upload`);
    };

    return (
        <div className="space-y-6">
            <CyberCard title="Generador de Cuestionarios IA (Beta)" className="min-h-[300px]">
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/20 rounded-xl bg-card/30 hover:bg-card/50 transition-colors">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="application/pdf"
                        className="hidden"
                    />

                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <BrainCircuit className="h-8 w-8 text-primary" />
                    </div>

                    <p className="text-lg font-semibold mb-2">Carga tu Balotario o Material</p>
                    <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                        Nuestra IA analizará el contenido para crear un cuestionario de práctica personalizado.
                    </p>

                    <NeonButton onClick={() => fileInputRef.current?.click()} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                        {loading ? "Analizando contenido..." : "Subir PDF y Generar"}
                    </NeonButton>

                    {progress && <p className="mt-4 text-sm text-primary animate-pulse">{progress}</p>}
                </div>
            </CyberCard>

            {result && (
                <CyberCard title="Análisis de Contenido">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-green-500/10 rounded flex items-center justify-center text-green-500">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold">{result.fileName}</h4>
                                <p className="text-xs text-muted-foreground">{result.pages.length} páginas analizadas</p>
                            </div>
                        </div>
                        <NeonButton onClick={handleGenerateQuiz} className="gap-2 animate-pulse">
                            <Play className="h-4 w-4" /> Generar Cuestionario Ahora
                        </NeonButton>
                    </div>

                    {/* OCR Warning summary */}
                    {result.pages.some(p => p.requiresOcr) && (
                        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-3 text-yellow-500 text-sm">
                            <AlertTriangle className="h-4 w-4" />
                            <p>
                                Se detectaron <strong>{result.pages.filter(p => p.requiresOcr).length}</strong> páginas escaneadas.
                                La precisión de las preguntas puede variar.
                            </p>
                        </div>
                    )}

                    <div className="space-y-4 opacity-50 pointer-events-none filter blur-[2px]">
                        <h5 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Vista Previa del Análisis</h5>
                        <div className="grid gap-4 md:grid-cols-2">
                            {result.pages.slice(0, 2).map((page) => (
                                <div key={page.page} className="p-4 rounded border border-border bg-background/50 h-24 overflow-hidden relative">
                                    <p className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                                        {page.text.substring(0, 150)}...
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CyberCard>
            )}
        </div>
    )
}
