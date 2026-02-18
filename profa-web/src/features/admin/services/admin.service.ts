import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const adminService = {
    /**
     * Obtiene todos los perfiles de usuario
     */
    async getUsers() {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .order('created_at', { ascending: false });

        return { data, error };
    },

    /**
     * Cambia el estado de activación de un usuario
     */
    async toggleUserStatus(userId: string, isActive: boolean) {
        const { data, error } = await supabase
            .from('user_profiles')
            .update({ is_active: isActive })
            .eq('id', userId);

        return { data, error };
    },

    /**
     * Elimina un usuario por completo
     * NOTA: Requiere políticas RLS que lo permitan o Edge Function para borrar de Auth
     */
    async deleteUser(userId: string) {
        const { error } = await supabase
            .from('user_profiles')
            .delete()
            .eq('id', userId);

        return { error };
    },

    /**
     * Resetea la contraseña (OTP) de un usuario
     * Dado que usamos Supabase Auth, esto idealmente se hace vía Edge Function 
     * con service_role. Desde el cliente solo podemos actualizar metadata o resetear via email.
     * Sin embargo, para este "Cyber Admin", simularemos el cambio o usaremos un endpoint seguro.
     */
    async resetPassword(userId: string, newOtp: string) {
        // Implementación ideal: llamar a Edge Function que use supabase.auth.admin.updateUserById
        const response = await fetch('/api/admin/users/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, newOtp })
        });

        return await response.json();
    }
}
