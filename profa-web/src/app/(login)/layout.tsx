import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Acceso | Lex Nova 31° PROFA",
    description: "Sistema de Evaluación Lex Nova",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FF3300] selection:text-white">
            {children}
        </div>
    );
}
