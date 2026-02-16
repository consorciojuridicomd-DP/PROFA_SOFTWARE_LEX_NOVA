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

// Normaliza contraseña para cumplir con el mínimo de 6 caracteres de Supabase
// sin que el usuario tenga que escribir más de 4.
function normalizePassword(pass: string): string {
    if (!pass) return pass;
    // Si ya es larga (e.g. legacy admin), no tocamos nada, pero para nuevas de 4 dígitos
    // añadimos un sufijo interno. El usuario solo ve/usa sus 4 dígitos.
    if (pass.length <= 5) return `${pass}_PROFA`;
    return pass;
}

export const authService = {
    login: async (dni: string, password: string): Promise<User> => {
        const supabase = createClient();
        const internalEmail = dniToEmail(dni);
        const internalPass = normalizePassword(password);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: internalEmail,
            password: internalPass,
        });

        if (error) {
            // Re-intento para passwords antiguas sin normalizar (ADMINISTRADOR, ADMI, etc)
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email: internalEmail,
                password,
            });

            if (retryError) throw error;
            if (!retryData?.user) throw new Error("No user returned");

            // Si el re-intento funciona, procesamos con ese usuario
            return this.processLoggedInUser(supabase, retryData.user!, internalEmail, dni);
        }

        if (!data?.user) throw new Error("No user returned");
        return this.processLoggedInUser(supabase, data.user!, internalEmail, dni);
    },

    // Helper para procesar el login una vez autenticado
    processLoggedInUser: async (supabase: any, authUser: any, internalEmail: string, dni: string): Promise<User> => {
        if (!authUser) throw new Error("No auth user provided");

        // Fetch profile
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

        // Block inactive users
        if (profile && profile.is_active === false) {
            await supabase.auth.signOut();
            throw new Error("Tu cuenta está pendiente de activación por el administrador.");
        }

        return {
            id: authUser.id,
            email: internalEmail,
            dni: profile?.dni || dni,
            full_name: profile?.full_name || authUser.user_metadata?.full_name,
            role: profile?.role || 'student',
            is_active: profile?.is_active ?? false,
        };
    },

    register: async (dni: string, password: string, fullName: string): Promise<User> => {
        const supabase = createClient();
        const internalEmail = dniToEmail(dni);
        const internalPass = normalizePassword(password);

        const { data, error } = await supabase.auth.signUp({
            email: internalEmail,
            password: internalPass,
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
