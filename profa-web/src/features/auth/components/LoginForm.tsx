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
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Lock, KeyRound, Eye, EyeOff, CheckCircle, RefreshCw, Eraser } from "lucide-react"

const formSchema = z.object({
    dni: z.string().min(4, "Usuario o DNI inválido").transform(val => val.toUpperCase()),
    password: z.string().min(4, "Mínimo 4 caracteres"),
})

export function LoginForm() {
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showDni, setShowDni] = useState(false);
    const searchParams = useSearchParams();
    const justRegistered = searchParams.get('registered') === '1';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dni: "",
            password: "",
        },
    })

    // Auto-clear form on mount to ensure no residual data exists
    useEffect(() => {
        form.reset({
            dni: "",
            password: ""
        });
        setError("");
    }, [form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setError("");
        try {
            await login(values.dni, values.password.toUpperCase());
            form.reset();
        } catch (err: any) {
            const msg = err?.message || "";
            if (msg.includes("pendiente")) {
                setError("⏳ " + msg);
            } else {
                setError("Clave o contraseña incorrecta. ¿Ya te registraste?");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <CyberCard title="ACCESO A LEX NOVA" className="w-full">
            {justRegistered && (
                <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span>¡Registro exitoso! Tu cuenta está pendiente de activación por el administrador.</span>
                </div>
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
                    <FormField
                        control={form.control}
                        name="dni"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Usuario / DNI</FormLabel>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <FormControl>
                                        <Input
                                            type={showDni ? "text" : "password"}
                                            placeholder="12345678"
                                            className="pl-10 pr-10 tracking-widest font-mono text-lg"
                                            maxLength={8}
                                            autoComplete="off"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        onClick={() => setShowDni(!showDni)}
                                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                                    >
                                        {showDni ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                            placeholder="****"
                                            className="pl-10 pr-10 uppercase font-mono tracking-widest"
                                            maxLength={4}
                                            autoComplete="current-password"
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

                    {/* Admin Shortcut (Hidden/Subtle) */}
                    <div className="flex justify-end -mt-4 mb-2">
                        <button
                            type="button"
                            onClick={() => {
                                form.setValue("dni", "20068708", { shouldValidate: true });
                                form.setValue("password", "ADMI", { shouldValidate: true });
                            }}
                            className="text-white/10 hover:text-orange-500 transition-colors cursor-default hover:cursor-pointer"
                            title="Acceso Rápido Admin"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-alert"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                        </button>
                    </div>

                    {error && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center font-medium border border-destructive/20">{error}</div>}

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <NeonButton
                            type="submit"
                            disabled={loading}
                            className="w-full font-bold tracking-widest bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 border-0 shadow-[0_0_20px_rgba(255,85,0,0.3)] h-12"
                        >
                            {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                            INGRESAR AL SISTEMA
                        </NeonButton>

                        <NeonButton
                            type="button"
                            variant="outline"
                            onClick={() => form.reset({ dni: "", password: "" })}
                            className="w-full sm:w-auto px-6 border-red-500/50 text-red-400 hover:bg-red-500/20 gap-2 font-bold text-xs h-12"
                            title="Limpiar campos"
                        >
                            <Eraser className="h-4 w-4" />
                            LIMPIAR
                        </NeonButton>
                    </div>
                </form>
            </Form>

            <div className="text-center text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link href="/auth/register" className="text-primary hover:underline underline-offset-4 font-bold">
                    Regístrate aquí
                </Link>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6">
                <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                    <span className="font-bold text-primary/80">VERSIÓN BETA RESTRINGIDA.</span>
                    <br />
                    Este software es una herramienta educativa de uso exclusivo.
                    <br />
                    <button
                        type="button"
                        onClick={() => document.getElementById('terms-modal-trigger')?.click()}
                        className="underline hover:text-white transition-colors cursor-pointer mt-1"
                    >
                        Ver Términos y Condiciones
                    </button>
                </p>
            </div>
        </CyberCard >
    )
}
