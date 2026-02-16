export interface Option {
    id: string;
    text: string;
}

export interface Question {
    id: string;
    stem: string;
    options: Option[];
    category: string;
    topic?: string;
    // Enhanced review fields
    explanation?: string; // Supports markdown/HTML for syllogism
    source?: string;
    sourceUrl?: string; // URL to the legal source
    correctOptionId?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Expert';
    // Case Study Context
    caseContext?: string; // Text for "Hechos del Caso" or shared scenario
}

export interface ExamConfig {
    questionCount: number;
    durationMinutes: number | null; // null = free mode
    topics: string[];
    difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Expert' | null; // null = mix
}

export interface ExamSession {
    id: string;
    templateId: string | null;
    config: ExamConfig;
    startedAt: Date;
    endsAt: Date | null;
    questions: Question[];
    responses: Record<string, string[]>; // questionId -> optionIds
    flagged: string[]; // questionIds
}

export interface ExamTemplate {
    id: string;
    name: string;
    description: string;
    questionCount: number;
    durationMinutes: number;
}
