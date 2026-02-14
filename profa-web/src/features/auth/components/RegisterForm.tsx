"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "../hooks/useAuth"
import { NeonButton } from "@/shared/ui/NeonButton"
import { CyberCard } from "@/shared/ui/CyberCard"
import { Input } from "@/shared/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form"
import Link from "next/link"
import { useState } from "react"
import { Lock, KeyRound, User, Eye, EyeOff } from "lucide-react"

const formSchema = z.object({
    fullName: z.string().min(2, "Nombre requerido"),
    dni: z.string().min(8, "DNI debe tener 8 dígitos").max(8, "DNI debe tener 8 dígitos").regex(/^\d+$/, "Solo números"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

export function RegisterForm() {
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            dni: "",
            password: "",
            confirmPassword: "",
        },
    })

    function getFriendlyError(msg: string): string {
        if (msg.includes("rate limit")) return "⏳ Demasiados intentos. Espera 5 minutos.";
        if (msg.includes("already registered") || msg.includes("already been registered")) return "Este DNI ya está registrado. Usa 'Inicia Sesión'.";
        return msg || "Error al registrar. Intenta de nuevo.";
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setError("");
        try {
            await register(values.dni, values.password.toUpperCase(), values.fullName);
        } catch (err: any) {
            setError(getFriendlyError(err?.message || ""));
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <CyberCard title="REGISTRO LEX NOVA" className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Nombre */}
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre Completo</FormLabel>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <FormControl>
                                        <Input placeholder="Juan Pérez" className="pl-10" {...field} />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* DNI */}
                    <FormField
                        control={form.control}
                        name="dni"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>DNI (8 dígitos)</FormLabel>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <FormControl>
                                        <Input
                                            placeholder="12345678"
                                            className="pl-10 tracking-widest font-mono text-lg"
                                            maxLength={8}
                                            inputMode="numeric"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Contraseña */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <FormControl>
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="******"
                                            className="pl-10 pr-10 uppercase"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Confirmar Contraseña */}
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmar Contraseña</FormLabel>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <FormControl>
                                        <Input
                                            type={showConfirm ? "text" : "password"}
                                            placeholder="******"
                                            className="pl-10 pr-10 uppercase"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                                    >
                                        {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {error && <p className="text-sm text-destructive text-center">{error}</p>}

                    <NeonButton type="submit" className="w-full mt-4" disabled={loading}>
                        {loading ? "Registrando..." : "CREAR CUENTA"}
                    </NeonButton>

                    <div className="text-center text-sm text-muted-foreground">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/auth/login" className="text-primary hover:underline underline-offset-4 font-bold">
                            Inicia Sesión
                        </Link>
                    </div>
                </form>
            </Form>
        </CyberCard>
    )
}
