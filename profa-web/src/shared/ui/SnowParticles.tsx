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
                const size = 2 + Math.random() * 3.5;              // 2–5.5px (larger snowflakes)
                const left = Math.random() * 100;                  // random horizontal %
                const delay = Math.random() * 10;                  // shorter stagger for immediate effect
                const duration = 8 + Math.random() * 14;           // 8–22s (faster fall)
                const isAmber = Math.random() > 0.7;               // 30% amber, 70% white
                const opacity = 0.4 + Math.random() * 0.6;         // 0.4–1.0 opacity
                const animName = `snowfall-${(i % 3) + 1}`;

                return (
                    <span
                        key={i}
                        style={{
                            position: "absolute",
                            top: "-5vh",
                            left: `${left}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            borderRadius: "50%",
                            background: isAmber
                                ? "rgba(255, 170, 50, 0.8)"
                                : "rgba(255, 255, 255, 0.8)",
                            boxShadow: isAmber
                                ? "0 0 6px rgba(255,120,0,0.6)"
                                : "0 0 5px rgba(255,255,255,0.5)",
                            opacity: opacity,
                            animation: `${animName} ${duration}s ${delay}s linear infinite`,
                        }}
                    />
                );
            })}
        </div>
    );
}
