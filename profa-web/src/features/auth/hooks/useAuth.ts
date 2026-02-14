"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService, User } from "../services/auth.service"

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        authService.getCurrentUser()
            .then(setUser)
            .finally(() => setLoading(false))
    }, [])

    const login = async (dni: string, password: string) => {
        const loggedUser = await authService.login(dni, password);
        setUser(loggedUser);
        if (loggedUser.role === 'admin') {
            router.push("/dashboard");
        } else {
            router.push("/app");
        }
    }

    const register = async (dni: string, password: string, fullName: string) => {
        await authService.register(dni, password, fullName);
        router.push("/auth/login?registered=1");
    }

    const logout = async () => {
        await authService.logout();
        setUser(null);
        router.push("/");
    }

    return { user, loading, login, register, logout }
}
