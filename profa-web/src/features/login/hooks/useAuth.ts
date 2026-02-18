"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const userWithMeta = session?.user ? {
                ...session.user,
                full_name: session.user.user_metadata?.full_name || "Aspirante",
                role: session.user.user_metadata?.role || "student"
            } : null;
            setUser(userWithMeta as any);
            setLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const userWithMeta = session?.user ? {
                    ...session.user,
                    full_name: session.user.user_metadata?.full_name || "Aspirante",
                    role: session.user.user_metadata?.role || "student"
                } : null;
                setUser(userWithMeta as any);
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return {
        user,
        loading,
        isAuthenticated: !!user,
        async signOut() {
            await supabase.auth.signOut();
        },
        async logout() {
            await supabase.auth.signOut();
        }
    };
}
