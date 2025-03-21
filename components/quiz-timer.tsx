"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface QuizTimerProps {
  isRunning: boolean
}

export function QuizTimer({ isRunning }: QuizTimerProps) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRunning])

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <Card>
      // Update time display text
      <CardContent className="flex items-center gap-4 p-4">
        <Clock className="h-6 w-6 text-blue-500" />
        <div className="space-y-1">
          <span className="text-sm font-semibold text-gray-600">Practice Timer</span>
          <span className="text-2xl font-mono text-blue-600">
            {formatTime(seconds)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}