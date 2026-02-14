"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/shared/lib/supabase/client"
import { CyberCard } from "@/shared/ui/CyberCard"
import { NeonButton } from "@/shared/ui/NeonButton"
import { Toggle } from "@/shared/ui/Toggle"
import { Users, Shield, ShieldOff, UserCheck, UserX, RefreshCw, Search } from "lucide-react"

interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    dni: string | null;
    role: string;
    is_active: boolean;
    created_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase.rpc('admin_get_users');
        if (!error && data) {
            setUsers(Array.isArray(data) ? data : []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleActive = async (userId: string, newStatus: boolean) => {
        setToggling(userId);
        const supabase = createClient();
        const { error } = await supabase.rpc('toggle_user_active', {
            p_user_id: userId,
            p_is_active: newStatus,
        });
        if (!error) {
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, is_active: newStatus } : u
            ));
        }
        setToggling(null);
    };

    const changeRole = async (userId: string, newRole: string) => {
        const supabase = createClient();
        const { error } = await supabase.rpc('admin_set_role', {
            p_user_id: userId,
            p_role: newRole,
        });
        if (!error) {
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, role: newRole } : u
            ));
        }
    };

    const filteredUsers = users.filter(user =>
        (user.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.dni || "").includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Users className="h-7 w-7 text-primary" />
                        Gestión de Usuarios
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Controla el acceso de los usuarios al sistema
                    </p>
                </div>
                <NeonButton onClick={fetchUsers} variant="outline" className="gap-2 self-start md:self-auto">
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualizar
                </NeonButton>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CyberCard title="" className="!p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{users.length}</p>
                            <p className="text-xs text-muted-foreground">Total Usuarios</p>
                        </div>
                    </div>
                </CyberCard>
                <CyberCard title="" className="!p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <UserCheck className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{users.filter(u => u.is_active).length}</p>
                            <p className="text-xs text-muted-foreground">Activos</p>
                        </div>
                    </div>
                </CyberCard>
                <CyberCard title="" className="!p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <UserX className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{users.filter(u => !u.is_active).length}</p>
                            <p className="text-xs text-muted-foreground">Pendientes / Suspendidos</p>
                        </div>
                    </div>
                </CyberCard>
            </div>

            {/* Search & Table */}
            <CyberCard title="" className="!p-0 overflow-hidden">
                <div className="p-4 border-b border-border">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o DNI..."
                            className="w-full pl-9 pr-4 py-2 bg-muted/20 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-border bg-card/50">
                                <th className="px-6 py-4 font-medium text-muted-foreground">Usuario</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground">DNI / Email</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground">Rol</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground">Estado</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                                        Cargando usuarios...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
                                                    {(user.full_name || user.email)?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <span className="font-medium">{user.full_name || 'Sin nombre'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <div className="flex flex-col">
                                                <span className="text-white/80">{user.dni || "—"}</span>
                                                <span className="text-xs">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => changeRole(user.id, e.target.value)}
                                                className="bg-background border border-border rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                            >
                                                <option value="student">Estudiante</option>
                                                <option value="docente">Docente</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.is_active ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                                    Inactivo
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                {toggling === user.id ? (
                                                    <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                                                ) : (
                                                    <Toggle
                                                        checked={user.is_active}
                                                        onChange={(checked) => toggleActive(user.id, checked)}
                                                        labels={{ on: "ON", off: "OFF" }}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CyberCard>
        </div>
    );
}
