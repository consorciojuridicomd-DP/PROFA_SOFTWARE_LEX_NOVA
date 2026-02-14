"use client"

import { CyberCard } from "@/shared/ui/CyberCard";
import { NeonButton } from "@/shared/ui/NeonButton";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { PdfExtractor } from "@/features/pdf/components/PdfExtractor";
import { useState } from "react";

export default function AdminImportPage() {
    const [apiKey, setApiKey] = useState("");

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Importar Preguntas (PDF)</h2>
                <p className="text-muted-foreground">Herramienta para cargar exámenes masivamente desde archivos PDF.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <CyberCard title="Cargar Archivo">
                        <div className="space-y-4">
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex gap-3 text-sm text-primary/80">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <p>
                                    Este módulo permite procesar PDFs de exámenes anteriores.
                                    El sistema intentará extraer automáticamente las preguntas, alternativas y la respuesta correcta.
                                </p>
                            </div>

                            {/* Aquí iría el componente real de importación */}
                            <div className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold text-lg">Arrastra tu PDF aquí</h3>
                                <p className="text-sm text-muted-foreground mt-1">o haz clic para seleccionar</p>
                                <NeonButton className="mt-4 pointer-events-none">Seleccionar Archivo</NeonButton>
                            </div>
                        </div>
                    </CyberCard>

                    <CyberCard title="Historial de Importaciones">
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            No hay importaciones recientes.
                        </div>
                    </CyberCard>
                </div>

                <div className="space-y-6">
                    <CyberCard title="Instrucciones">
                        <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-4">
                            <li>El PDF debe ser texto seleccionable (no escaneado).</li>
                            <li>Formato ideal: Pregunta numerada, seguida de alternativas con letras (a, b, c, d).</li>
                            <li>La clave de respuestas puede estar al final.</li>
                            <li>Máximo 10MB por archivo.</li>
                        </ul>
                    </CyberCard>
                </div>
            </div>
        </div>
    );
}
