export interface StudyRecommendation {
    id: string;
    topic: string; // Keep for display
    category: string; // Keep for display
    subtopic: string; // New: Subtopic name
    categoryId: string;
    topicId: string;
    subtopicId: string;
    priority: "High" | "Medium" | "Low";
    mastery: number; // 0-100
    goal: number; // 0-100
    recommendedAction: "Quiz" | "Video" | "Read";
    reason: string;
    estimatedTime: string;
}

export interface Subtopic {
    id: string;
    name: string;
}

export interface Topic {
    id: string;
    name: string;
    subtopics: Subtopic[];
}

export interface Category {
    id: string;
    name: string;
    topics: Topic[];
}

export const KNOWLEDGE_BASE: Category[] = [
    {
        id: "penal",
        name: "Derecho Penal",
        topics: [
            {
                id: "teoria_delito",
                name: "Teoría del Delito",
                subtopics: [
                    { id: "tipicidad", name: "Tipicidad" },
                    { id: "antijuridicidad", name: "Antijuridicidad" },
                    { id: "culpabilidad", name: "Culpabilidad" },
                    { id: "iter_criminis", name: "Iter Criminis" },
                    { id: "autoria", name: "Autoría y Participación" },
                    { id: "concurso", name: "Concurso de Delitos" }
                ]
            },
            {
                id: "parte_especial",
                name: "Parte Especial",
                subtopics: [
                    { id: "homicidio", name: "Homicidio" },
                    { id: "lesiones", name: "Lesiones" },
                    { id: "patrimonio", name: "Delitos contra el Patrimonio" },
                    { id: "admi_publica", name: "Delitos contra la Admi. Pública" }
                ]
            }
        ]
    },
    {
        id: "civil",
        name: "Derecho Civil",
        topics: [
            {
                id: "acto_juridico",
                name: "Acto Jurídico",
                subtopics: [
                    { id: "validez", name: "Validez y Nulidad" },
                    { id: "vicios", name: "Vicios de la Voluntad" },
                    { id: "representacion", name: "Representación" }
                ]
            },
            {
                id: "contratos",
                name: "Contratos",
                subtopics: [
                    { id: "parte_general_contratos", name: "Parte General" },
                    { id: "compraventa", name: "Compraventa" },
                    { id: "arrendamiento", name: "Arrendamiento" }
                ]
            },
            {
                id: "reales",
                name: "Derechos Reales",
                subtopics: [
                    { id: "posesion", name: "Posesión" },
                    { id: "propiedad", name: "Propiedad" },
                    { id: "garantias", name: "Garantías Reales" }
                ]
            }
        ]
    },
    {
        id: "administrativo",
        name: "Derecho Administrativo",
        topics: [
            {
                id: "acto_admin",
                name: "Acto Administrativo",
                subtopics: [
                    { id: "validez_eficacia", name: "Validez y Eficacia" },
                    { id: "nulidad_admin", name: "Nulidad" },
                    { id: "silencio", name: "Silencio Administrativo" }
                ]
            },
            {
                id: "proc_admin",
                name: "Procedimiento Administrativo",
                subtopics: [
                    { id: "etapas", name: "Etapas del Procedimiento" },
                    { id: "recursos", name: "Recursos Impugnatorios" },
                    { id: "potestad", name: "Potestad Sancionadora" }
                ]
            }
        ]
    },
    {
        id: "procesal_civil",
        name: "Procesal Civil",
        topics: [
            {
                id: "tutela",
                name: "Tutela Jurisdiccional",
                subtopics: [
                    { id: "derecho_accion", name: "Derecho de Acción" },
                    { id: "competencia", name: "Competencia" }
                ]
            },
            {
                id: "procesos",
                name: "Procesos",
                subtopics: [
                    { id: "conocimiento", name: "Proceso de Conocimiento" },
                    { id: "abreviado", name: "Proceso Abreviado" },
                    { id: "ejecutivo", name: "Proceso Ejecutivo" },
                    { id: "cautelar", name: "Medidas Cautelares" }
                ]
            }
        ]
    },
    {
        id: "constitucional",
        name: "Derecho Constitucional",
        topics: [
            {
                id: "derechos_fundamentales",
                name: "Derechos Fundamentales",
                subtopics: [
                    { id: "dignidad", name: "Dignidad Humana" },
                    { id: "igualdad", name: "Igualdad y No Discriminación" },
                    { id: "debido_proceso", name: "Debido Proceso" }
                ]
            },
            {
                id: "procesos_const",
                name: "Procesos Constitucionales",
                subtopics: [
                    { id: "habeas_corpus", name: "Habeas Corpus" },
                    { id: "amparo", name: "Amparo" },
                    { id: "habeas_data", name: "Habeas Data" }
                ]
            }
        ]
    }
];

export const MOCK_RECOMMENDATIONS: StudyRecommendation[] = [
    {
        id: "rec_1",
        topic: "Teoría del Delito",
        subtopic: "Tipicidad",
        category: "Derecho Penal",
        categoryId: "penal",
        topicId: "teoria_delito",
        subtopicId: "tipicidad",
        priority: "High",
        mastery: 35,
        goal: 80,
        recommendedAction: "Video",
        reason: "Precisión crítica (<40%) en últimos 2 simulacros.",
        estimatedTime: "15 min"
    },
    {
        id: "rec_2",
        topic: "Acto Administrativo",
        subtopic: "Validez y Eficacia",
        category: "Derecho Administrativo",
        categoryId: "administrativo",
        topicId: "acto_admin",
        subtopicId: "validez_eficacia",
        priority: "Medium",
        mastery: 55,
        goal: 75,
        recommendedAction: "Quiz",
        reason: "Conceptos clave confusos (Validez vs Eficacia).",
        estimatedTime: "20 min"
    },
    {
        id: "rec_3",
        topic: "Contratos",
        subtopic: "Compraventa",
        category: "Derecho Civil",
        categoryId: "civil",
        topicId: "contratos",
        subtopicId: "compraventa",
        priority: "Low",
        mastery: 72,
        goal: 85,
        recommendedAction: "Read",
        reason: "Mantenimiento de nivel. Reforzar vicios ocultos.",
        estimatedTime: "10 min"
    },
    {
        id: "rec_4",
        topic: "Procesos",
        subtopic: "Medidas Cautelares",
        category: "Procesal Civil",
        categoryId: "procesal_civil",
        topicId: "procesos",
        subtopicId: "cautelar",
        priority: "High",
        mastery: 40,
        goal: 80,
        recommendedAction: "Quiz",
        reason: "Alta frecuencia en exámenes pasados.",
        estimatedTime: "25 min"
    }
];

// Helper to get the top priority recommendation
export const getTopRecommendation = () => {
    // Return the first "High" priority item, or just the first item
    return MOCK_RECOMMENDATIONS.find(r => r.priority === "High") || MOCK_RECOMMENDATIONS[0];
};
