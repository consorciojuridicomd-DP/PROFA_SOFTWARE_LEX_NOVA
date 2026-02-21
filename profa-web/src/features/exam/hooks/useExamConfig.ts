"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  CONTROLLER — MVC  (Capa de Lógica)                             ║
 * ║  useExamConfig.ts                                               ║
 * ║                                                                  ║
 * ║  Propósito: gestionar el estado y las reglas de negocio de la   ║
 * ║  página de selección de examen SIN saber nada de cómo se pinta. ║
 * ║                                                                   ║
 * ║  Sigue el principio SoC definido en buena-practica-desarrollo.md║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { examService, mapTopicsToDb } from "../services/exam.service";
import { ExamConfig } from "../types";

// ── Constantes de dominio ────────────────────────────────────────────────────
export const KNOWLEDGE_TOPICS = [
    "Derecho Penal",
    "Derecho Civil",
    "Derecho Constitucional",
    "Derecho Procesal Penal",
    "Derecho Procesal Civil",
    "Argumentación Jurídica",
    "Derecho Administrativo",
    "Derecho de la Competencia",
    "Derecho de Propiedad Intelectual",
    "Derecho Registral",
    "Derecho Minero",
    "Derecho Previsional",
    "Derecho Publicitario",
] as const;

export const CASE_TOPICS = [
    "Casos Prácticos Penal",
    "Casos Prácticos Civil",
    "Casos Prácticos Constitucional",
    "Casos Prácticos Administrativo",
    "Casos Prácticos Laboral",
    "Casos Prácticos Comercial",
    "Casos Prácticos Tributario",
] as const;

export const QUESTION_COUNTS = [10, 20, 30, 40, 50] as const;

// ── Tipos ────────────────────────────────────────────────────────────────────
export interface ExamConfigState {
    config: ExamConfig;
    /** Total de preguntas disponibles para los temas seleccionados. null = cargando/error */
    availableCount: number | null;
    /** Cuántas preguntas se van a usar REALMENTE en el examen */
    effectiveCount: number;
    byTopic: Record<string, number>;
    loadingCount: boolean;
    loadingStart: boolean;
    error: string | null;
    // ── Acciones ──
    setQuestionCount: (n: number) => void;
    setDuration: (m: number | null) => void;
    toggleTopic: (topic: string) => void;
    clearKnowledge: () => void;
    clearCases: () => void;
    toggleAllCases: () => void;
    handleStart: () => Promise<void>;
}

// ── Hook Controller ──────────────────────────────────────────────────────────
export function useExamConfig(): ExamConfigState {
    const router = useRouter();

    // ── Estado ──
    const [config, setConfig] = useState<ExamConfig>({
        questionCount: 10,
        durationMinutes: 10,
        topics: [],
    });
    const [availableCount, setAvailableCount] = useState<number | null>(null);
    const [byTopic, setByTopic] = useState<Record<string, number>>({});
    const [loadingCount, setLoadingCount] = useState(false);
    const [loadingStart, setLoadingStart] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ── Debounce ref para evitar llamadas simultáneas al RPC ─────────────────
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Sincronización de disponibilidad ─────────────────────────────────────
    const syncAvailable = useCallback(async (topics: string[]) => {
        setLoadingCount(true);
        try {
            const { total, byTopic: bt } = await examService.getAvailableCount(topics);
            setAvailableCount(total);
            setByTopic(bt);

            // NOTA: Ya no auto-ajustamos a la baja. 
            // Si el usuario pide 50 y hay 0, el fallback IA/Web generará lo faltante.
        } catch (err) {
            console.error("Error fetching availability:", err);
            setAvailableCount(null); // null indica que usaremos IA/Web si es necesario
        } finally {
            setLoadingCount(false);
        }
    }, []);

    // Re-sincronizar con debounce de 300 ms al cambiar temas
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            syncAvailable(config.topics);
        }, 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [config.topics, syncAvailable]);

    // ── Computed ─────────────────────────────────────────────────────────────
    /** 
     * El número efectivo es el que el usuario PIDIÓ.
     * Ya no limitamos a la disponibilidad de la DB.
     */
    const effectiveCount = config.questionCount;

    // ── Acciones ─────────────────────────────────────────────────────────────
    const setQuestionCount = (n: number) =>
        setConfig(prev => ({ ...prev, questionCount: n }));

    const setDuration = (m: number | null) =>
        setConfig(prev => ({ ...prev, durationMinutes: m }));

    /**
     * ACCIÓN: Selección Única Global (Comportamiento Radio Button).
     */
    const toggleTopic = (topic: string) => {
        setConfig(prev => {
            const isAlreadySelected = prev.topics.includes(topic);
            return {
                ...prev,
                topics: isAlreadySelected ? [] : [topic]
            };
        });
    };

    const clearKnowledge = () => setConfig(prev => ({ ...prev, topics: [] }));
    const clearCases = () => setConfig(prev => ({ ...prev, topics: [] }));
    const toggleAllCases = () => setConfig(prev => ({ ...prev, topics: [] }));

    const handleStart = async () => {
        setError(null);
        if (effectiveCount < 1) {
            setError("Selecciona un número de preguntas válido.");
            return;
        }
        setLoadingStart(true);
        try {
            const dbTopics = mapTopicsToDb(config.topics);

            const session = await examService.startSession({
                ...config,
                topics: dbTopics,
                questionCount: effectiveCount,
            });
            if (!session?.id) throw new Error("La sesión se creó sin ID válido.");
            router.push(`/app/exam/${session.id}`);
        } catch (err: any) {
            setError(err.message || "Error al iniciar el examen. Reintenta.");
            setLoadingStart(false);
        }
    };

    return {
        config,
        availableCount,
        effectiveCount,
        byTopic,
        loadingCount,
        loadingStart,
        error,
        setQuestionCount,
        setDuration,
        toggleTopic,
        clearKnowledge,
        clearCases,
        toggleAllCases,
        handleStart,
    };
}
