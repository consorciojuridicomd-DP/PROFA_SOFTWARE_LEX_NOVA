import { QuestionEditor } from "@/features/admin/components/QuestionEditor";

export const dynamic = "force-dynamic";

export default function NewQuestionPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Nueva Pregunta</h2>
                <p className="text-muted-foreground">Agrega una nueva pregunta al banco de datos.</p>
            </div>

            <QuestionEditor />
        </div>
    );
}
