"use client"

import { AdminTable } from "@/features/admin/components/AdminTable";
import { CyberCard } from "@/shared/ui/CyberCard";
import { NeonButton } from "@/shared/ui/NeonButton";
import { Plus } from "lucide-react";

const MOCK_CATEGORIES = [
    { id: "1", name: "Derecho Penal", count: 120, status: "Activo" },
    { id: "2", name: "Derecho Civil", count: 95, status: "Activo" },
    { id: "3", name: "Derecho Constitucional", count: 80, status: "Activo" },
    { id: "4", name: "Derecho Procesal Penal", count: 110, status: "Activo" },
    { id: "5", name: "Argumentación Jurídica", count: 45, status: "Borrador" },
];

export default function CategoriesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categorías</h2>
                    <p className="text-muted-foreground">Administra los temas y áreas de estudio.</p>
                </div>
                <NeonButton className="gap-2">
                    <Plus className="h-4 w-4" /> Nueva Categoría
                </NeonButton>
            </div>

            <CyberCard>
                <AdminTable
                    columns={[
                        { header: "Nombre", accessor: "name" },
                        { header: "Preguntas", accessor: "count" },
                        { header: "Estado", accessor: "status" },
                    ]}
                    data={MOCK_CATEGORIES}
                    onEdit={(item) => console.log("Edit", item)}
                    onDelete={(item) => console.log("Delete", item)}
                />
            </CyberCard>
        </div>
    );
}
