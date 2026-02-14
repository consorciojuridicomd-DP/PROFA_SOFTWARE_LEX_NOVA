"use client"

import { useState, useEffect } from "react"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { CyberCard } from "@/shared/ui/CyberCard"
import { BarChart2, Activity, Hexagon } from "lucide-react"

const data = [
    { name: "Penal", score: 85 },
    { name: "Civil", score: 65 },
    { name: "Const.", score: 90 },
    { name: "Admin", score: 45 },
    { name: "Laboral", score: 70 },
]

export function CategoryBarChart() {
    const [mounted, setMounted] = useState(false)
    const [chartType, setChartType] = useState<"bar" | "line" | "radar">("bar")

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return (
        <CyberCard title="Rendimiento por Categoría" className="h-[400px]">
            <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">
                Cargando gráfico...
            </div>
        </CyberCard>
    )

    return (
        <CyberCard className="h-[400px] relative">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold leading-none tracking-tight">Rendimiento por Categoría</h3>
                <div className="flex bg-secondary/50 rounded-lg p-1 gap-1">
                    <button
                        onClick={() => setChartType("bar")}
                        className={`p-1.5 rounded-md transition-all ${chartType === "bar" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"}`}
                        title="Barras"
                    >
                        <BarChart2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setChartType("line")}
                        className={`p-1.5 rounded-md transition-all ${chartType === "line" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"}`}
                        title="Líneas"
                    >
                        <Activity className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setChartType("radar")}
                        className={`p-1.5 rounded-md transition-all ${chartType === "radar" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"}`}
                        title="Radar"
                    >
                        <Hexagon className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {chartType === "bar" ? (
                        <BarChart data={data}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #333", borderRadius: "8px" }}
                                itemStyle={{ color: "#fff" }}
                                cursor={{ fill: "rgba(255,85,0,0.1)" }}
                            />
                            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.score > 80 ? "#FF5500" : entry.score > 60 ? "#FF8800" : "#ef4444"} />
                                ))}
                            </Bar>
                        </BarChart>
                    ) : chartType === "line" ? (
                        <LineChart data={data}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #333", borderRadius: "8px" }}
                                itemStyle={{ color: "#fff" }}
                            />
                            <Line type="monotone" dataKey="score" stroke="#FF5500" strokeWidth={3} dot={{ r: 4, fill: "#FF5500" }} activeDot={{ r: 6, fill: "#fff" }} />
                        </LineChart>
                    ) : (
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <PolarGrid stroke="#333" />
                            <PolarAngleAxis dataKey="name" tick={{ fill: "#888", fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#888", fontSize: 10 }} />
                            <Radar name="Puntaje" dataKey="score" stroke="#FF5500" fill="#FF5500" fillOpacity={0.3} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #333", borderRadius: "8px" }}
                                itemStyle={{ color: "#fff" }}
                            />
                        </RadarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </CyberCard>
    )
}
