"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react"

interface QuizResultsProps {
  score: number
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  onRestart: () => void
}

export function QuizResults({
  score,
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  onRestart,
}: QuizResultsProps) {
  const percentage = (score / totalQuestions) * 100

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Quiz Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="text-center">
            <p className="text-5xl font-bold text-primary">{percentage.toFixed(0)}%</p>
            <p className="text-sm text-muted-foreground">Final Score</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2 rounded-lg border p-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">Correct Answers</p>
              <p className="text-2xl font-bold">{correctAnswers}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-4">
            <XCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm font-medium">Wrong Answers</p>
              <p className="text-2xl font-bold">{wrongAnswers}</p>
            </div>
          </div>
        </div>

        <Button onClick={onRestart} className="w-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  )
} 