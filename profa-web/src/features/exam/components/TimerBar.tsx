"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface TimerBarProps {
    endsAt: Date;
    onExpire?: () => void;
}

export function TimerBar({ endsAt, onExpire }: TimerBarProps) {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(endsAt).getTime();
            const distance = end - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft(0);
                if (onExpire) onExpire();
            } else {
                setTimeLeft(distance);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endsAt, onExpire]);

    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    const isLowTime = timeLeft < 300000; // 5 mins

    return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-card/80 backdrop-blur text-foreground font-mono font-bold shadow-[0_0_10px_rgba(255,85,0,0.1)]">
            <Clock className={`h-4 w-4 ${isLowTime ? "text-destructive animate-pulse" : "text-primary"}`} />
            <span className={isLowTime ? "text-destructive" : "text-foreground"}>
                {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
        </div>
    )
}
