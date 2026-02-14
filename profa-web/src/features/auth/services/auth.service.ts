import { createClient } from "@/shared/lib/supabase/client";

export interface User {
    id: string;
    email: string;
    dni: string;
    full_name?: string;
    role: 'student' | 'admin' | 'docente';
    is_active?: boolean;
}

// Convierte DNI a email interno para Supabase Auth
function dniToEmail(dni: string): string {
    return `${dni}@lexnova.app`;
}

export const authService = {
    login: async (dni: string, password: string): Promise<User> => {
        const supabase = createClient();
        const internalEmail = dniToEmail(dni);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: internalEmail,
            password,
        });

        if (error) {
            throw error;
        }

        if (!data.user) {
            throw new Error("No user returned");
        }

        // Fetch profile
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        // Block inactive users
        if (profile && profile.is_active === false) {
            await supabase.auth.signOut();
            throw new Error("Tu cuenta está pendiente de activación por el administrador.");
        }

        return {
            id: data.user.id,
            email: internalEmail,
            dni: profile?.dni || dni,
            full_name: profile?.full_name || data.user.user_metadata?.full_name,
            role: profile?.role || 'student',
            is_active: profile?.is_active ?? false,
        };
    },

    register: async (dni: string, password: string, fullName: string): Promise<User> => {
        const supabase = createClient();
        const internalEmail = dniToEmail(dni);

        const { data, error } = await supabase.auth.signUp({
            email: internalEmail,
            password,
            options: {
                data: {
                    full_name: fullName,
                    dni: dni,
                },
            },
        });

        if (error) {
            throw error;
        }

        if (data.user) {
            // Update profile with DNI
            await supabase
                .from('user_profiles')
                .update({
                    dni: dni,
                    full_name: fullName,
                })
                .eq('id', data.user.id);

            // Sign out — user must wait for admin activation
            await supabase.auth.signOut();

            return {
                id: data.user.id,
                email: internalEmail,
                dni: dni,
                full_name: fullName,
                role: 'student',
                is_active: false,
            };
        }

        throw new Error("Registro fallido");
    },

    logout: async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
    },

    getCurrentUser: async (): Promise<User | null> => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return null;

        const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        // If inactive, sign out
        if (profile && profile.is_active === false) {
            await supabase.auth.signOut();
            return null;
        }

        return {
            id: user.id,
            email: user.email!,
            dni: profile?.dni || '',
            full_name: profile?.full_name || user.user_metadata?.full_name,
            role: profile?.role || 'student',
            is_active: profile?.is_active ?? false,
        };
    }
};
