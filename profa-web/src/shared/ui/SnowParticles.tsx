"use client"

import { useState, useEffect } from "react"

export function SnowParticles() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null;

    const particles = Array.from({ length: 150 }, (_, i) => i);

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
            {particles.map((i) => {
                const size = 1 + Math.random() * 2;                // 1–3px
                const left = Math.random() * 100;                  // random horizontal %
                const delay = Math.random() * -30;                 // negative delay for immediate fill
                const duration = 15 + Math.random() * 20;          // 15–35s (slow fall)
                const opacity = 0.2 + Math.random() * 0.4;         // 0.2–0.6 opacity (low-medium)
                const drift = (Math.random() - 0.5) * 60;          // lateral drift in px

                return (
                    <div
                        key={i}
                        className="absolute top-[-5%]"
                        style={{
                            left: `${left}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.8)",
                            opacity: opacity,
                            filter: `blur(${size > 2 ? '0.5px' : '0px'})`,
                            animation: `snow-drift-${i} ${duration}s linear infinite`,
                            animationDelay: `${delay}s`,
                        }}
                    >
                        <style>{`
                            @keyframes snow-drift-${i} {
                                0% {
                                    transform: translateY(0) translateX(0);
                                }
                                100% {
                                    transform: translateY(110vh) translateX(${drift}px);
                                }
                            }
                        `}</style>
                    </div>
                );
            })}
        </div>
    );
}
