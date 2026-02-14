import { CyberCard } from "@/shared/ui/CyberCard"

export default function HistoryPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Historial de Exámenes</h2>
            <CyberCard title="Últimos Intentos">
                <p className="text-muted-foreground">Aquí aparecerá el listado de tus simulacros anteriores.</p>
                {/* TODO: Add Data Table with history */}
            </CyberCard>
        </div>
    )
}
