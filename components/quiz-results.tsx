"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react"

interface QuizResultsProps {
  score: number;
  totalQuestions: number; 
  correctAnswers: number;
  wrongAnswers: number;
  onRetry: () => void;
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
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <div className="container flex-1 flex items-center justify-center py-8 md:py-12">
          <div className="w-full max-w-2xl">
            <Card className="shadow-sm">
              <CardHeader className="space-y-2">
                <CardTitle className="text-center text-2xl font-bold text-foreground">Quiz Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex justify-center">
                  <div className="text-center">
                    <p className="text-6xl font-bold text-primary mb-2">{percentage.toFixed(0)}%</p>
                    <p className="text-sm text-muted-foreground">Final Score: {score} points</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Correct Answers</p>
                      <p className="text-2xl font-bold text-foreground">{correctAnswers}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                      <XCircle className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Wrong Answers</p>
                      <p className="text-2xl font-bold text-foreground">{wrongAnswers}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={onRetry} size="lg" className="gap-2 px-8">
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 