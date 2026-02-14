"use client"

import { useState, useEffect } from "react"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { CyberCard } from "@/shared/ui/CyberCard"

const data = [
    { name: "Correctas", value: 65, color: "#00ff88" }, // Green
    { name: "Incorrectas", value: 25, color: "#ef4444" }, // Red
    { name: "Omitidas", value: 10, color: "#888888" }, // Grey
]

export function DonutChart() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return (
        <CyberCard title="Desempeño Global" className="h-[350px]">
            <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">
                Cargando gráfico...
            </div>
        </CyberCard>
    )

    return (
        <CyberCard title="Desempeño Global" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #333" }}
                        itemStyle={{ color: "#fff" }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </CyberCard>
    )
}
