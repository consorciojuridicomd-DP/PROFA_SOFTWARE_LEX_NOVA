"use client"

import { CyberCard } from "@/shared/ui/CyberCard"
import { NeonButton } from "@/shared/ui/NeonButton"
import { Globe, Youtube, Linkedin, Facebook, Share2, MessageCircle, Phone, Mail, Video, MonitorPlay } from "lucide-react"

// Group 1: Social Networks (Icon Only)
const SOCIAL_NETWORKS = [
    { name: "Facebook", url: "https://www.facebook.com/derechoperu.edu.pe/", icon: <Facebook className="h-4 w-4" /> },
    { name: "LinkedIn", url: "https://www.linkedin.com/company/derecho-peru/", icon: <Linkedin className="h-4 w-4" /> },
    { name: "YouTube", url: "https://www.youtube.com/channel/UCyAvl-hsH4ZC5JRsQZNfc-A", icon: <Youtube className="h-4 w-4" /> },
    { name: "TikTok", url: "https://www.tiktok.com/@derechoperu.edu.pe", icon: <MonitorPlay className="h-4 w-4" /> },
    { name: "Web Oficial", url: "https://derechoperu.edu.pe/", icon: <Globe className="h-4 w-4" /> },
];

// Group 2: Contact Info (Text Required)
const CONTACT_INFO = [
    { name: "+51 906 776 270", url: "https://wa.me/51906776270", icon: <MessageCircle className="h-4 w-4" />, label: "WhatsApp" },
    { name: "+51 990 308 096", url: "tel:+51990308096", icon: <Phone className="h-4 w-4" />, label: "Llamar" },
    { name: "derechoperuredes@gmail.com", url: "mailto:derechoperuredes@gmail.com", icon: <Mail className="h-4 w-4" />, label: "Email Redes" },
    { name: "consorciojuridicomd@gmail.com", url: "mailto:consorciojuridicomd@gmail.com", icon: <Mail className="h-4 w-4" />, label: "Email Consorcio" },
];

interface CommunitySectionProps {
    compact?: boolean;
    className?: string;
}

export function CommunitySection({ compact = false, className }: CommunitySectionProps) {
    return (
        <CyberCard className={`bg-card/30 backdrop-blur-md border-primary/20 ${className}`}>
            <div className={`flex ${compact ? 'flex-col gap-6' : 'flex-col md:flex-row items-start md:items-center justify-between gap-6'} p-2`}>

                {/* Header Section */}
                <div className="flex items-center gap-4 shrink-0">
                    <div className="p-3 rounded-full bg-primary/20 text-primary shrink-0">
                        <Share2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Únete a la Comunidad</h3>
                        <p className="text-sm text-muted-foreground">Síguenos para más contenido jurídico.</p>
                    </div>
                </div>

                {/* Links Container */}
                <div className="flex flex-col gap-4 w-full md:w-auto">

                    {/* 1. Social Icons Row (Icon Only) */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                        {SOCIAL_NETWORKS.map(link => (
                            <NeonButton
                                key={link.name}
                                variant="outline"
                                size="icon"
                                onClick={() => window.open(link.url, "_blank")}
                                className="h-10 w-10 border-primary/30 hover:bg-primary/20"
                                title={link.name}
                            >
                                {link.icon}
                            </NeonButton>
                        ))}
                    </div>

                    {/* 2. Contact Info Grid (Text Visible) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {CONTACT_INFO.map(link => (
                            <NeonButton
                                key={link.name}
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(link.url, "_blank")}
                                className="justify-start gap-2 h-auto py-2 px-3 text-xs font-mono text-muted-foreground hover:text-primary border border-transparent hover:border-primary/20"
                            >
                                {link.icon}
                                <span className="truncate">{link.name}</span>
                            </NeonButton>
                        ))}
                    </div>
                </div>
            </div>
        </CyberCard>
    )
}
