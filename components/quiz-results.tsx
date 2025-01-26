"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react"

interface QuizResultsProps {
  score: number
  correctAnswers: number
  wrongAnswers: number
  onRetry: () => void
}

export function QuizResults({
  score,
  correctAnswers,
  wrongAnswers,
  onRetry,
}: QuizResultsProps) {
  const totalQuestions = correctAnswers + wrongAnswers
  const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-2xl px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-foreground">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="text-center">
                <p className="text-5xl font-bold text-primary">{percentage.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Final Score</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-4">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">Correct Answers</p>
                  <p className="text-2xl font-bold text-foreground">{correctAnswers}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-4">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">Wrong Answers</p>
                  <p className="text-2xl font-bold text-foreground">{wrongAnswers}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={onRetry} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 