"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/shared/lib/supabase/client"
import { AdminTable } from "@/features/admin/components/AdminTable"
import { CyberCard } from "@/shared/ui/CyberCard"
import { NeonButton } from "@/shared/ui/NeonButton"
import { Plus, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const supabase = createClient()

export default function QuestionsPage() {
    const router = useRouter()
    const [questions, setQuestions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchQuestions()
    }, [])

    const fetchQuestions = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('preguntas')
                .select(`
                    id,
                    enunciado,
                    dificultad,
                    estado,
                    materias (nombre)
                `)
                .eq('estado', 'active') // Only show active for now, or all? Let's show active
                .order('created_at', { ascending: false })
                .limit(50) // Limit for performance

            if (data) {
                const formatted = data.map(q => {
                    // Supabase returns relations as arrays sometimes, need to handle both just in case
                    const materiaName = Array.isArray(q.materias)
                        ? q.materias[0]?.nombre
                        : (q.materias as any)?.nombre;

                    return {
                        id: q.id,
                        stem: q.enunciado.substring(0, 100) + (q.enunciado.length > 100 ? "..." : ""),
                        category: materiaName || "General",
                        level: `Nivel ${q.dificultad}`
                    }
                })
                setQuestions(formatted)
            }
        } catch (e) {
            console.error("Error fetching questions", e)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar esta pregunta?")) return

        const { error } = await supabase
            .from('preguntas')
            .update({ estado: 'archived' })
            .eq('id', id)

        if (!error) {
            setQuestions(prev => prev.filter(q => q.id !== id))
        }
    }

    const filteredData = questions.filter(q =>
        q.stem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Banco de Preguntas</h2>
                    <p className="text-muted-foreground">Gestiona las preguntas del balotario ({questions.length} visibles).</p>
                </div>
                <Link href="/admin/questions/new">
                    <NeonButton className="gap-2">
                        <Plus className="h-4 w-4" /> Nueva Pregunta
                    </NeonButton>
                </Link>
            </div>

            <CyberCard>
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar preguntas..."
                            className="w-full bg-background border border-border rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <AdminTable
                        columns={[
                            { header: "Enunciado", accessor: "stem" },
                            { header: "Materia", accessor: "category" },
                            { header: "Dificultad", accessor: "level" },
                        ]}
                        data={filteredData}
                        onEdit={(item) => console.log("Edit TODO", item)}
                        onDelete={(item) => handleDelete(item.id)}
                    />
                )}
            </CyberCard>
        </div>
    );
}
