import { createBrowserClient } from '@supabase/ssr'

export const loginService = {
    async login(emailOrDni: string, password: string) {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // 1. Intentar Login con Email/Password (Donde password es el código de 4 dígitos)
        // El email puede venir como DNI si se implementa búsqueda previa, por ahora asumimos Email.
        const { data, error } = await supabase.auth.signInWithPassword({
            email: emailOrDni.includes('@') ? emailOrDni : `${emailOrDni}@dni.com`, // Fallback si es DNI
            password: password,
        })

        if (error) return { data: null, error }

        // 2. Obtener el perfil para verificar el rol
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', data.user.id)
            .single()

        return { data: { user: data.user, profile }, error: null }
    },

    async register(email: string, password: string, fullName: string, dni: string) {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // 1. Registrar en Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    dni: dni,
                    role: 'student'
                }
            }
        })

        if (authError) return { data: null, error: authError }

        // El perfil se crea automáticamente vía trigger de base de datos que definimos en el Segmento 1.
        // Solo retornamos éxito.
        return { data: authData, error: null }
    }
}
