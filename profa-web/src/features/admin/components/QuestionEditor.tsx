"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { createClient } from "@/shared/lib/supabase/client"
import { NeonButton } from "@/shared/ui/NeonButton"
import { CyberCard } from "@/shared/ui/CyberCard"
import { Save, Plus, Trash2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const supabase = createClient()

type Alternative = {
    texto: string
    es_correcta: boolean
}

type QuestionForm = {
    materia_id: string
    subtema_id: string
    enunciado: string
    dificultad: number
    explicacion: string
    fuente_bibliografica: string
    alternativas: Alternative[]
}

export function QuestionEditor() {
    const router = useRouter()
    const [materias, setMaterias] = useState<any[]>([])
    const [subtemas, setSubtemas] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<QuestionForm>({
        defaultValues: {
            dificultad: 3,
            alternativas: [
                { texto: "", es_correcta: false },
                { texto: "", es_correcta: false },
                { texto: "", es_correcta: false },
                { texto: "", es_correcta: false }
            ]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "alternativas"
    })

    const selectedMateria = watch("materia_id")

    useEffect(() => {
        const fetchMaterias = async () => {
            const { data } = await supabase.from('materias').select('*').order('nombre')
            if (data) setMaterias(data)
        }
        fetchMaterias()
    }, [])

    useEffect(() => {
        const fetchSubtemas = async () => {
            if (!selectedMateria) {
                setSubtemas([])
                return
            }
            const { data } = await supabase.from('subtemas').select('*').eq('materia_id', selectedMateria).order('nombre')
            if (data) setSubtemas(data)
        }
        fetchSubtemas()
    }, [selectedMateria])

    const setCorrectOption = (index: number) => {
        const currentAlts = watch("alternativas")
        const newAlts = currentAlts.map((alt, i) => ({
            ...alt,
            es_correcta: i === index
        }))
        setValue("alternativas", newAlts)
    }

    const onSubmit = async (data: QuestionForm) => {
        setLoading(true)
        setError(null)
        try {
            // 1. Insert Question
            const { data: questionData, error: questionError } = await supabase
                .from('preguntas')
                .insert({
                    materia_id: data.materia_id || null,
                    subtema_id: data.subtema_id || null,
                    enunciado: data.enunciado,
                    dificultad: data.dificultad,
                    explicacion: data.explicacion,
                    fuente_bibliografica: data.fuente_bibliografica,
                    estado: 'active',
                    type: 'single' // Default to single choice
                })
                .select()
                .single()

            if (questionError) throw questionError

            // 2. Insert Options
            const optionsToInsert = data.alternativas.map((alt, index) => ({
                pregunta_id: questionData.id,
                texto: alt.texto,
                es_correcta: alt.es_correcta,
                orden: index
            }))

            const { error: optionsError } = await supabase
                .from('alternativas')
                .insert(optionsToInsert)

            if (optionsError) throw optionsError

            // Success
            router.push("/dashboard")
            router.refresh()

        } catch (e: any) {
            console.error(e)
            setError(e.message || "Error al guardar la pregunta")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
                <NeonButton type="button" variant="ghost" onClick={() => router.back()} className="gap-2 text-muted-foreground">
                    <ArrowLeft className="h-4 w-4" /> Volver
                </NeonButton>
                <NeonButton type="submit" disabled={loading} className="gap-2 bg-green-500 hover:bg-green-600 border-green-500/50">
                    <Save className="h-4 w-4" /> {loading ? "Guardando..." : "Guardar Pregunta"}
                </NeonButton>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <CyberCard title="Enunciado">
                        <textarea
                            {...register("enunciado", { required: true })}
                            className="w-full min-h-[150px] p-4 bg-muted/10 border border-border rounded-lg resize-y focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="Escribe aquí la pregunta..."
                        />
                        {errors.enunciado && <span className="text-red-500 text-xs">El enunciado es obligatorio</span>}
                    </CyberCard>

                    <CyberCard title="Alternativas">
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-3 items-start p-3 bg-muted/5 rounded-lg border border-border/50">
                                    <div
                                        className={`mt-2 flex-shrink-0 h-6 w-6 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all ${watch(`alternativas.${index}.es_correcta`) ? 'border-green-500 bg-green-500 text-black' : 'border-muted-foreground'}`}
                                        onClick={() => setCorrectOption(index)}
                                        title="Marcar como correcta"
                                    >
                                        {watch(`alternativas.${index}.es_correcta`) && <CheckCircle className="h-4 w-4" />}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <textarea
                                            {...register(`alternativas.${index}.texto`, { required: true })}
                                            className="w-full p-2 bg-transparent border-b border-border focus:border-primary outline-none min-h-[40px] resize-none"
                                            placeholder={`Opción ${index + 1}`}
                                        />
                                    </div>
                                    <button type="button" onClick={() => remove(index)} className="text-muted-foreground hover:text-red-500 p-2">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <NeonButton type="button" variant="outline" onClick={() => append({ texto: "", es_correcta: false })} className="w-full gap-2 border-dashed">
                                <Plus className="h-4 w-4" /> Agregar Opción
                            </NeonButton>
                        </div>
                    </CyberCard>

                    <CyberCard title="Explicación (Retroalimentación)">
                        <textarea
                            {...register("explicacion")}
                            className="w-full min-h-[100px] p-4 bg-muted/10 border border-border rounded-lg resize-y focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="Explica por qué la respuesta correcta es la correcta..."
                        />
                    </CyberCard>
                </div>

                <div className="space-y-6">
                    <CyberCard title="Clasificación">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Materia</label>
                                <select {...register("materia_id")} className="w-full p-2 bg-muted/20 border border-border rounded-md text-sm">
                                    <option value="">Seleccionar Materia...</option>
                                    {materias.map(m => (
                                        <option key={m.id} value={m.id}>{m.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Subtema</label>
                                <select {...register("subtema_id")} className="w-full p-2 bg-muted/20 border border-border rounded-md text-sm">
                                    <option value="">Seleccionar Subtema...</option>
                                    {subtemas.map(s => (
                                        <option key={s.id} value={s.id}>{s.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Dificultad (1-5)</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(level => (
                                        <div
                                            key={level}
                                            onClick={() => setValue("dificultad", level)}
                                            className={`h-8 w-8 rounded-full flex items-center justify-center cursor-pointer border ${watch("dificultad") === level ? 'bg-primary text-black border-primary' : 'border-border hover:border-primary'}`}
                                        >
                                            {level}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CyberCard>

                    <CyberCard title="Metadatos">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Fuente Bibliográfica</label>
                            <input
                                {...register("fuente_bibliografica")}
                                className="w-full p-2 bg-muted/20 border border-border rounded-md text-sm"
                                placeholder="Ej: Código Penal Art. 10"
                            />
                        </div>
                    </CyberCard>
                </div>
            </div>
        </form>
    )
}
