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
    { name: "DERECHOPERUREDES@GMAIL.COM", url: "mailto:DERECHOPERUREDES@GMAIL.COM", icon: <Mail className="h-4 w-4" />, label: "Email Redes" },
    { name: "CONSORCIOJURIDICOMD@GMAIL.COM", url: "mailto:CONSORCIOJURIDICOMD@GMAIL.COM", icon: <Mail className="h-4 w-4" />, label: "Email Consorcio" },
];

interface CommunitySectionProps {
    compact?: boolean;
    className?: string;
}

export function CommunitySection({ compact = false, className }: CommunitySectionProps) {
    return (
        <CyberCard className={`bg-black/40 backdrop-blur-xl border-orange-500/20 shadow-[0_0_20px_rgba(255,85,0,0.1)] ${className}`}>
            <div className={`flex ${compact ? 'flex-col gap-6' : 'flex-col md:flex-row items-center justify-between gap-8'} p-6`}>

                {/* Header Section */}
                <div className="flex items-center gap-5 shrink-0">
                    <div className="p-4 rounded-xl bg-orange-600/10 text-orange-500 border border-orange-500/20 shadow-[0_0_15px_rgba(255,85,0,0.2)]">
                        <Share2 className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-wider">Únete a la Comunidad</h3>
                        <p className="text-sm text-gray-400 font-medium">Síguenos para más contenido jurídico.</p>
                    </div>
                </div>

                {/* Content Container (Contacts + Socials) */}
                <div className="flex flex-col gap-6 w-full md:w-auto">

                    {/* 1. Contact Info Grid (PROMPT ÚNICO) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                        {CONTACT_INFO.map(link => (
                            <button
                                key={link.name}
                                onClick={() => window.open(link.url, "_blank")}
                                className="flex items-center gap-3 text-[12px] font-bold text-gray-300 hover:text-orange-500 transition-colors uppercase tracking-tight group"
                            >
                                <span className="text-orange-600/60 group-hover:text-orange-500 group-hover:drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">{link.icon}</span>
                                <span className="truncate">{link.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* 2. Social Networks (SQUARE BUTTONS - BELOW CONTACTS) */}
                    <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                        {SOCIAL_NETWORKS.map(link => (
                            <button
                                key={link.name}
                                onClick={() => window.open(link.url, "_blank")}
                                className="h-14 w-14 flex items-center justify-center border border-orange-500/30 bg-black hover:bg-orange-600/20 hover:border-orange-500 transition-all text-white shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(255,85,0,0.3)]"
                                title={link.name}
                            >
                                {link.icon}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </CyberCard>
    )
}
