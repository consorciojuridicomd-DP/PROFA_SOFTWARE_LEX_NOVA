"use client"

import { useState, useEffect } from "react"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { CyberCard } from "@/shared/ui/CyberCard"

const data = [
    { name: "S1", score: 65 },
    { name: "S2", score: 72 },
    { name: "S3", score: 68 },
    { name: "S4", score: 85 },
    { name: "S5", score: 82 },
    { name: "S6", score: 90 },
]

export function ScoreTrendLine() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return (
        <CyberCard title="Evolución de Puntaje" className="h-[350px]">
            <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">
                Cargando gráfico...
            </div>
        </CyberCard>
    )

    return (
        <CyberCard title="Evolución de Puntaje" className="h-[350px]">
            <div className="h-full w-full pb-6">
                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #333" }}
                            itemStyle={{ color: "#fff" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#FF5500"
                            strokeWidth={2}
                            dot={{ fill: "#FF5500" }}
                            activeDot={{ r: 6, fill: "#fff" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </CyberCard>
    )
}
