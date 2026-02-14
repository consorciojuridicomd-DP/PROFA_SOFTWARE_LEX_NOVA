import { createClient } from "@/shared/lib/supabase/client";
import { ExamSession, ExamTemplate, Question, ExamConfig } from "../types";

export const examService = {
    getTemplates: async (): Promise<ExamTemplate[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('examenes')
            .select('*')
            .eq('activo', true);

        if (error) throw error;

        return data.map((e: any) => ({
            id: e.id,
            name: e.titulo,
            description: e.descripcion || "",
            questionCount: 0,
            durationMinutes: e.duracion_min
        }));
    },

    startSession: async (config: ExamConfig, examId?: string): Promise<ExamSession> => {
        const supabase = createClient();

        let targetExamId = examId;

        // If no examId provided, fetch the first active one (Fallback for Custom Exam mode)
        if (!targetExamId) {
            const { data: exams } = await supabase
                .from('examenes')
                .select('id')
                .eq('activo', true)
                .limit(1);

            if (exams && exams.length > 0) {
                targetExamId = exams[0].id;
            } else {
                throw new Error("No active exams found to start session.");
            }
        }

        // 1. Call RPC start_session
        const { data: sessionId, error } = await supabase.rpc('start_session', {
            p_examen_id: targetExamId,
            p_config: config
        });

        if (error) throw error;

        // 2. Fetch questions via RPC
        const { data: questionsData, error: qError } = await supabase.rpc('get_session_questions', {
            p_intento_id: sessionId
        });

        if (qError) throw qError;

        // Map questions
        const questions: Question[] = (questionsData || []).map((q: any) => ({
            id: q.id,
            stem: q.stem,
            category: q.category || 'General',
            options: (q.options || []).map((o: any) => ({ id: o.id, text: o.text })),
            difficulty: mapDifficulty(q.dificultad),
        }));

        const session: ExamSession = {
            id: sessionId,
            templateId: targetExamId!,
            config,
            startedAt: new Date(),
            endsAt: config.durationMinutes ? new Date(Date.now() + config.durationMinutes * 60000) : null,
            questions,
            responses: {},
            flagged: []
        };

        return session;
    },

    getReviewSession: async (sessionId: string): Promise<ExamSession | null> => {
        // Reuse getSession logic for now, as it fetches questions and responses.
        // In the future, this might fetch "correct answers" explicitly if getSession hides them.
        // Currently get_session_questions returns all info needed for review (options are there, 
        // but correctness might need to be checked against a separate RPC or if the user is allowed to see it).
        // For now, we assume getSession (via client-side logic or improved RPC) is sufficient.
        // Actually, the ReviewPage needs 'isCorrect' or 'correctOptionId'. 
        // The current get_session_questions RPC does NOT return correctOptionId for security.
        // We need to fetch the correct answers SEPARATELY since this is a REVIEW session.

        const session = await examService.getSession(sessionId);
        if (!session) return null;

        const supabase = createClient();

        // Fetch correct answers for these questions
        // We can do this efficiently by querying the 'alternativas' table for the correct ones
        // corresponding to the questions in the session.
        // Since we are in 'Review', we can assume the user has permission (or we should check).
        const questionIds = session.questions.map(q => q.id);

        if (questionIds.length > 0) {
            const { data: correctOptions } = await supabase
                .from('alternativas')
                .select('pregunta_id, id')
                .in('pregunta_id', questionIds)
                .eq('es_correcta', true);

            if (correctOptions) {
                const correctMap = new Map(correctOptions.map(c => [c.pregunta_id, c.id]));

                // Enrich questions with correctOptionId
                session.questions = session.questions.map(q => ({
                    ...q,
                    correctOptionId: correctMap.get(q.id)
                }));
            }
        }

        return session;
    },

    getSession: async (sessionId: string): Promise<ExamSession | null> => {
        const supabase = createClient();

        // 1. Get Intento
        const { data: intento, error } = await supabase
            .from('intentos')
            .select('*')
            .eq('id', sessionId)
            .single();

        if (error || !intento) return null;

        // 2. Get Questions
        const { data: questionsData, error: qError } = await supabase.rpc('get_session_questions', {
            p_intento_id: sessionId
        });

        if (qError) return null;

        const questions: Question[] = (questionsData || []).map((q: any) => ({
            id: q.id,
            stem: q.stem,
            category: q.category || 'General',
            options: (q.options || []).map((o: any) => ({ id: o.id, text: o.text })),
            difficulty: mapDifficulty(q.dificultad),
        }));

        // 3. Get Responses
        const { data: responsesData } = await supabase
            .from('respuestas')
            .select('pregunta_id, alternativa_id')
            .eq('intento_id', sessionId);

        const responses: Record<string, string[]> = {};
        if (responsesData) {
            responsesData.forEach((r: any) => {
                responses[r.pregunta_id] = [r.alternativa_id];
            });
        }

        return {
            id: intento.id,
            templateId: intento.examen_id,
            config: intento.metadata as ExamConfig,
            startedAt: new Date(intento.started_at),
            endsAt: intento.ended_at ? new Date(intento.ended_at) : null,
            questions,
            responses,
            flagged: []
        };
    },

    submitAnswer: async (sessionId: string, questionId: string, optionIds: string[]) => {
        const supabase = createClient();
        if (optionIds.length === 0) return;

        const { error } = await supabase.rpc('submit_answer', {
            p_intento_id: sessionId,
            p_pregunta_id: questionId,
            p_alternativa_id: optionIds[0]
        });

        if (error) {
            console.error("Failed to submit answer", error);
        }
    },

    finishSession: async (sessionId: string): Promise<{ score: number, total: number }> => {
        const supabase = createClient();
        const { data, error } = await supabase.rpc('finish_session', {
            p_intento_id: sessionId
        });

        if (error) throw error;

        return {
            score: data.score,
            total: data.total
        };
    }
};

function mapDifficulty(val: number): 'Easy' | 'Medium' | 'Hard' | 'Expert' {
    if (val <= 1) return 'Easy';
    if (val === 2) return 'Medium';
    if (val === 3) return 'Hard';
    return 'Expert';
}
