import { CyberCard } from "@/shared/ui/CyberCard";
import { ArrowUp, ArrowDown, Users, FileQuestion, Activity, BookOpen } from "lucide-react";

interface StatProps {
    title: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon: any;
    description: string;
}

function StatCard({ title, value, change, trend, icon: Icon, description }: StatProps) {
    return (
        <CyberCard className="relative overflow-hidden group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold mt-2">{value}</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
                {change && (
                    <span className={`flex items-center font-medium ${trend === 'up' ? 'text-green-500' :
                            trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                        }`}>
                        {trend === 'up' && <ArrowUp className="h-3 w-3 mr-1" />}
                        {trend === 'down' && <ArrowDown className="h-3 w-3 mr-1" />}
                        {change}
                    </span>
                )}
                <span className="text-muted-foreground ml-2">{description}</span>
            </div>

            {/* Background decoration */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
        </CyberCard>
    );
}

export function DataStats() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Usuarios Activos"
                value="1,234"
                change="+12%"
                trend="up"
                icon={Users}
                description="vs. mes anterior"
            />
            <StatCard
                title="Total Preguntas"
                value="2,850"
                change="+50"
                trend="up"
                icon={FileQuestion}
                description="nuevas esta semana"
            />
            <StatCard
                title="Exámenes Hoy"
                value="145"
                change="-5%"
                trend="down"
                icon={Activity}
                description="vs. ayer"
            />
            <StatCard
                title="Plantillas"
                value="12"
                trend="neutral"
                icon={BookOpen}
                description="disponibles"
            />
        </div>
    );
}
