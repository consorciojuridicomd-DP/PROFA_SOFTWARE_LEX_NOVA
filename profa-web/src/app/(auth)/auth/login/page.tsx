import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
