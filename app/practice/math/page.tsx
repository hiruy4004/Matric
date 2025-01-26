"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Brain, Loader2 } from "lucide-react"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { QuizResults } from "@/components/quiz-results"
import { Scoreboard } from "@/components/scoreboard"
import { QuizTimer } from "@/components/quiz-timer"
import { HintCard } from "@/components/hint-card"
import { generateMathQuestions } from "@/lib/math-questions"

interface Question {
  question: string
  correct_answer: string
  incorrect_answers: string[]
  difficulty: "easy" | "medium" | "hard"
  grade: number
  hint: string
}

export default function MathPracticePage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [hintsLeft, setHintsLeft] = useState(3)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [])

  useEffect(() => {
    if (questions.length > 0 && !showResults) {
      setIsTimerRunning(true)
    } else {
      setIsTimerRunning(false)
    }
  }, [questions.length, showResults])

  function fetchQuestions() {
    try {
      setIsLoading(true)
      const newQuestions = generateMathQuestions(10)
      setQuestions(newQuestions)
      setHintsLeft(3)
      setIsTimerRunning(true)
    } catch (error) {
      console.error("Error generating questions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleUseHint() {
    if (hintsLeft > 0) {
      setHintsLeft((prev) => prev - 1)
      setScore((prev) => Math.max(0, prev - 50)) // Deduct 50 points for using a hint
    }
  }

  async function handleAnswer(answer: string) {
    if (isChecking) return
    setIsChecking(true)
    setSelectedAnswer(answer)

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    const currentQuestion = questions[currentQuestionIndex]
    if (answer === currentQuestion.correct_answer) {
      setScore((prev) => prev + (streak + 1) * 10)
      setStreak((prev) => prev + 1)
      setCorrectAnswers((prev) => prev + 1)
    } else {
      setStreak(0)
      setWrongAnswers((prev) => prev + 1)
    }

    // Wait a bit before moving to next question
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSelectedAnswer(null)
    setIsChecking(false)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setShowResults(true)
      setIsTimerRunning(false)
    }
  }

  function handleRestart() {
    setCurrentQuestionIndex(0)
    setScore(0)
    setStreak(0)
    setCorrectAnswers(0)
    setWrongAnswers(0)
    setShowResults(false)
    setSelectedAnswer(null)
    setIsChecking(false)
    setHintsLeft(3)
    fetchQuestions()
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-8 md:py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="text-lg text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <QuizResults
            score={score}
            totalQuestions={questions.length}
            correctAnswers={correctAnswers}
            wrongAnswers={wrongAnswers}
            onRestart={handleRestart}
          />
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const allAnswers = [
    currentQuestion.correct_answer,
    ...currentQuestion.incorrect_answers,
  ].sort(() => Math.random() - 0.5)

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full space-y-8 lg:w-3/4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Link>
                </Button>
                <div className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  <h1 className="text-3xl font-bold">Mathematics Practice</h1>
                </div>
              </div>
              <div className="space-y-2">
                <Progress value={progress} className="w-[200px]" />
                <p className="text-sm text-muted-foreground text-center">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>

            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Grade {currentQuestion.grade} Mathematics</CardTitle>
                <DifficultyBadge difficulty={currentQuestion.difficulty} />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-muted p-6">
                  <p className="text-xl font-medium">{currentQuestion.question}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {allAnswers.map((answer, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === answer 
                        ? answer === currentQuestion.correct_answer 
                          ? "default" 
                          : "destructive"
                        : "outline"
                      }
                      className={`h-12 text-lg transition-colors ${
                        isChecking ? "cursor-not-allowed" : ""
                      } ${
                        selectedAnswer === answer && answer === currentQuestion.correct_answer
                          ? "bg-green-500 hover:bg-green-500"
                          : ""
                      }`}
                      onClick={() => handleAnswer(answer)}
                      disabled={isChecking}
                    >
                      {answer}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full space-y-4 lg:w-1/4">
            <Scoreboard
              score={score}
              streak={streak}
              correctAnswers={correctAnswers}
              wrongAnswers={wrongAnswers}
              grade={currentQuestion.grade}
            />
            <QuizTimer isRunning={isTimerRunning} />
            <HintCard
              hint={currentQuestion.hint}
              hintsLeft={hintsLeft}
              onUseHint={handleUseHint}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
