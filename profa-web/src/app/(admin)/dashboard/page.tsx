import { DataStats } from "@/features/admin/components/DataStats";
import { PendingUsersWidget } from "@/features/admin/components/PendingUsersWidget";
import { CyberCard } from "@/shared/ui/CyberCard";
import { NeonButton } from "@/shared/ui/NeonButton";
import { Plus, Upload, FileText, Settings } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Bienvenido al panel de administración de LexNova.</p>
                </div>

                {/* Botones de acción rápida movidos a su contexto (o eliminados de aquí si confunden) */}
                {/* El usuario pidió segmentación. Vamos a dejar solo un link a configuración real si hace falta */}
                <Link href="/admin/settings">
                    <NeonButton variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
                        <Settings className="h-4 w-4" /> Configuración Global
                    </NeonButton>
                </Link>
            </div>

            <DataStats />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 h-[400px]">
                {/* Widget Principal: Activación de Usuarios (Reemplaza Actividad Reciente) */}
                <div className="lg:col-span-5 h-full">
                    <PendingUsersWidget />
                </div>

                {/* Accesos Rápidos (Reemplaza Estado del Sistema) */}
                <CyberCard className="lg:col-span-2 h-full flex flex-col" title="Acciones Rápidas">
                    <div className="flex flex-col gap-3 h-full justify-center">
                        <Link href="/admin/questions/new" className="w-full">
                            <NeonButton className="w-full justify-start gap-3 h-12" variant="outline">
                                <Plus className="h-5 w-5 text-primary" />
                                <div className="flex flex-col items-start">
                                    <span className="font-bold text-sm">Crear Pregunta</span>
                                    <span className="text-[10px] text-muted-foreground">Agregar item al banco</span>
                                </div>
                            </NeonButton>
                        </Link>

                        <Link href="/admin/import" className="w-full">
                            <NeonButton className="w-full justify-start gap-3 h-12" variant="outline">
                                <Upload className="h-5 w-5 text-blue-400" />
                                <div className="flex flex-col items-start">
                                    <span className="font-bold text-sm">Importar PDF</span>
                                    <span className="text-[10px] text-muted-foreground">Carga masiva</span>
                                </div>
                            </NeonButton>
                        </Link>

                        <Link href="/admin/users" className="w-full">
                            <NeonButton className="w-full justify-start gap-3 h-12" variant="outline">
                                <FileText className="h-5 w-5 text-green-400" />
                                <div className="flex flex-col items-start">
                                    <span className="font-bold text-sm">Gestionar Usuarios</span>
                                    <span className="text-[10px] text-muted-foreground">Ver base completa</span>
                                </div>
                            </NeonButton>
                        </Link>
                    </div>
                </CyberCard>
            </div>
        </div>
    );
}
