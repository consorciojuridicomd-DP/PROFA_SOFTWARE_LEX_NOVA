"use client";

import { LoginForm } from "@/features/login/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4">
            {/* Container con efecto de cristal y bordes neón */}
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}
