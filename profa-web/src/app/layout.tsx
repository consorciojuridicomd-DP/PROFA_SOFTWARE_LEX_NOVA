import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Future/Tech look
import "./globals.css";
import { cn } from "@/shared/lib/utils";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Derecho Perú – PROFA SOFTWARE LexNova",
  description: "Actualización inteligente para la nueva Magistratura: destaca en la evaluación.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={cn(outfit.variable, "min-h-screen bg-background font-sans antialiased")}>
        {children}
      </body>
    </html>
  );
}
