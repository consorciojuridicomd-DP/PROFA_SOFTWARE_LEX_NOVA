import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { MobileSidebar } from "@/shared/ui/MobileSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-[url('/circuits.svg')] bg-fixed bg-center bg-[length:400px_400px] flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar (Navbar style) */}
            <MobileSidebar />

            <main className="flex-1 overflow-y-auto p-4 md:p-8 relative pt-20 md:pt-8">
                {/* Ambient glow in main area */}
                <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] -z-10 pointer-events-none" />
                <div className="container mx-auto max-w-7xl animate-in fade-in duration-500 pb-20 md:pb-0">
                    {children}
                </div>
            </main>
        </div>
    );
}

