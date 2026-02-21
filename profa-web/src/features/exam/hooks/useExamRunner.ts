"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { examService } from "../services/exam.service";
import { ExamSession, Question } from "../types";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  CONTROLLER — MVC  (Capa de Lógica)                             ║
 * ║  useExamRunner.ts                                               ║
 * ║                                                                  ║
 * ║  Propósito: Gestionar el estado del examen en tiempo real,      ║
 * ║  la navegación entre preguntas, el temporizador y el envío     ║
 * ║  de respuestas.                                                ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

export function useExamRunner(sessionId: string) {
    const router = useRouter();

    const [session, setSession] = useState<ExamSession | null>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [finishing, setFinishing] = useState(false);
    const [showFinishModal, setShowFinishModal] = useState(false);

    // ── Carga Inicial ────────────────────────────────────────────────────────
    useEffect(() => {
        async function loadSession() {
            if (!sessionId) return;
            try {
                const sess = await examService.getSession(sessionId);
                setSession(sess);
            } catch (err) {
                console.error("Error loading session:", err);
            } finally {
                setLoading(false);
            }
        }
        loadSession();
    }, [sessionId]);

    // ── Acciones de Navegación ────────────────────────────────────────────────
    const nextQuestion = () => {
        if (!session) return;
        setCurrentIdx(prev => Math.min(session.questions.length - 1, prev + 1));
    };

    const prevQuestion = () => {
        setCurrentIdx(prev => Math.max(0, prev - 1));
    };

    const goToQuestion = (index: number) => {
        setCurrentIdx(index);
    };

    // ── Manejo de Respuestas ──────────────────────────────────────────────────
    const handleOptionSelect = (optionId: string) => {
        if (!session || !session.questions[currentIdx]) return;

        const questionId = session.questions[currentIdx].id;
        const newResponses = { ...session.responses, [questionId]: [optionId] };

        setSession({ ...session, responses: newResponses });

        // Persistir en servidor (optimistic update local ya hecho)
        examService.submitAnswer(session.id, questionId, [optionId]);
    };

    const handleFlag = () => {
        if (!session || !session.questions[currentIdx]) return;

        const questionId = session.questions[currentIdx].id;
        const isFlagged = session.flagged.includes(questionId);
        const newFlagged = isFlagged
            ? session.flagged.filter(id => id !== questionId)
            : [...session.flagged, questionId];

        setSession({ ...session, flagged: newFlagged });
    };

    // ── Finalización ──────────────────────────────────────────────────────────
    const handleFinishExam = async () => {
        if (!session) return;
        setFinishing(true);
        try {
            await examService.finishSession(session.id);
            router.push(`/app/results/${session.id}`);
        } catch (err) {
            console.error("Error finishing session:", err);
            setFinishing(false);
        }
    };

    const onTimerExpire = () => {
        handleFinishExam();
    };

    // ── Computed ──────────────────────────────────────────────────────────────
    const currentQuestion = session?.questions[currentIdx] || null;
    const isFirstQuestion = currentIdx === 0;
    const isLastQuestion = session ? currentIdx === session.questions.length - 1 : true;
    const progressPercent = session ? (Object.keys(session.responses).length / session.questions.length) * 100 : 0;

    return {
        session,
        currentIdx,
        currentQuestion,
        loading,
        finishing,
        showFinishModal,
        setShowFinishModal,
        isFirstQuestion,
        isLastQuestion,
        progressPercent,
        // Methods
        nextQuestion,
        prevQuestion,
        goToQuestion,
        handleOptionSelect,
        handleFlag,
        handleFinishExam,
        onTimerExpire
    };
}
