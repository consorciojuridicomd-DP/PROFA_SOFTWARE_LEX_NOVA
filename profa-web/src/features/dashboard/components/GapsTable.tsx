"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table"

export function GapsTable() {
    const gaps = [
        { category: "Derecho Administrativo", topic: "Acto Administrativo", accuracy: 32, priority: "High" },
        { category: "Derecho Penal", topic: "Teoría del Delito", accuracy: 45, priority: "Medium" },
        { category: "Derecho Civil", topic: "Contratos Modernos", accuracy: 58, priority: "Medium" },
    ]

    return (
        <div className="rounded-md border border-border bg-card/50 backdrop-blur-sm">
            <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Brechas de Conocimiento (Prioridad)</h3>
            </div>
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-border">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoría</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tema</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Acierto</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Prioridad</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {gaps.map((gap, i) => (
                            <tr key={i} className="border-b border-border transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle font-medium">{gap.category}</td>
                                <td className="p-4 align-middle">{gap.topic}</td>
                                <td className="p-4 align-middle text-destructive font-bold">{gap.accuracy}%</td>
                                <td className="p-4 align-middle">
                                    <span className="inline-flex items-center rounded-full border border-destructive/50 bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                                        Alta
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
