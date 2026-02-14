"use client"

import { NeonButton } from "@/shared/ui/NeonButton";
import { Edit, Trash2, Eye } from "lucide-react";

interface Column {
    header: string;
    accessor: string;
    className?: string;
}

interface AdminTableProps {
    columns: Column[];
    data: any[];
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
    onView?: (item: any) => void;
}

export function AdminTable({ columns, data, onEdit, onDelete, onView }: AdminTableProps) {
    return (
        <div className="w-full overflow-hidden rounded-lg border border-border bg-card/30 backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-border">
                            {columns.map((col, i) => (
                                <th key={i} className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${col.className}`}>
                                    {col.header}
                                </th>
                            ))}
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {data.map((row, i) => (
                            <tr key={i} className="border-b border-border transition-colors hover:bg-muted/50">
                                {columns.map((col, j) => (
                                    <td key={j} className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                        {row[col.accessor]}
                                    </td>
                                ))}
                                <td className="p-4 align-middle text-right flex justify-end gap-2">
                                    {onView && (
                                        <button onClick={() => onView(row)} className="p-2 hover:bg-primary/10 rounded-md text-muted-foreground hover:text-primary transition-colors">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    )}
                                    {onEdit && (
                                        <button onClick={() => onEdit(row)} className="p-2 hover:bg-blue-500/10 rounded-md text-muted-foreground hover:text-blue-500 transition-colors">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button onClick={() => onDelete(row)} className="p-2 hover:bg-red-500/10 rounded-md text-muted-foreground hover:text-red-500 transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                    No hay datos para mostrar.
                </div>
            )}
        </div>
    );
}
