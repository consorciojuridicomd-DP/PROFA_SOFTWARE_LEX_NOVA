import { CyberCard } from "@/shared/ui/CyberCard"
import { useAuth } from "@/features/login/hooks/useAuth";

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Perfil de Usuario</h2>
            <CyberCard title="Información Personal">
                <div className="space-y-4">
                    {/* Mock profile info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-muted-foreground">Nombre</label>
                            <p className="font-medium">Usuario Estudiante</p>
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">Email</label>
                            <p className="font-medium">student@profa.com</p>
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">Plan</label>
                            <p className="font-medium text-primary">Premium</p>
                        </div>
                    </div>
                </div>
            </CyberCard>
        </div>
    )
}
