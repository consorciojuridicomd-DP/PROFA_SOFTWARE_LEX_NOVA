import { PdfExtractor } from "@/features/pdf/components/PdfExtractor";

export default function PdfToolsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Herramientas PDF</h2>
                <p className="text-muted-foreground">Utilidades locales para procesar documentos de estudio.</p>
            </div>

            <PdfExtractor />
        </div>
    )
}
