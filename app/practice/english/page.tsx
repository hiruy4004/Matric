"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, BookOpen, AlertCircle, HelpCircle, Sparkles } from "lucide-react"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { QuizResults } from "@/components/quiz-results"
import { Scoreboard } from "@/components/scoreboard"
import { Difficulty } from "@/types/questions"
import { generateEnglishQuestions } from "@/lib/english-questions"
import { toast } from "sonner"

interface Question {
  question: string
  correct_answer: string
  incorrect_answers: string[]
  difficulty: Difficulty
  grade: number
  hint: string
}

export default function EnglishPracticePage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [questionAnswers, setQuestionAnswers] = useState<string[][]>([])

  useEffect(() => {
    fetchQuestions()
  }, [])

  function shuffleAnswers(correct: string, incorrect: string[]) {
    const allAnswers = [correct, ...incorrect]
    // Fisher-Yates shuffle
    for (let i = allAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]]
    }
    return allAnswers
  }

  function fetchQuestions() {
    try {
      setIsLoading(true)
      setError("")
      const newQuestions = generateEnglishQuestions(10)
      setQuestions(newQuestions)
      
      // Pre-generate all shuffled answers
      const shuffledAnswers = newQuestions.map(q => 
        shuffleAnswers(q.correct_answer, q.incorrect_answers)
      )
      setQuestionAnswers(shuffledAnswers)
      
      setCurrentQuestionIndex(0)
      setScore(0)
      setStreak(0)
      setCorrectAnswers(0)
      setWrongAnswers(0)
      setShowResults(false)
      setShowHint(false)
      setSelectedAnswer(null)
      setIsChecking(false)
    } catch (err) {
      setError("Failed to generate questions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAnswer(answer: string) {
    if (isChecking) return
    setIsChecking(true)
    setSelectedAnswer(answer)

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = answer === currentQuestion.correct_answer

    // Add delay to show the selected answer
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (isCorrect) {
      const newStreak = streak + 1
      setStreak(newStreak)
      setScore(prev => prev + (10 * (1 + Math.floor(newStreak / 3))))
      setCorrectAnswers(prev => prev + 1)
      toast.success(`🎯 Correct! Gained ${10 * (1 + Math.floor(newStreak / 3))} XP${newStreak > 1 ? ` (${newStreak}-question streak bonus)` : ''}`)
    } else {
      setStreak(0)
      setWrongAnswers(prev => prev + 1)
      toast.error("📘 Incorrect - Visit Study Hall to review this topic")
    }

    // Add delay before moving to next question
    await new Promise(resolve => setTimeout(resolve, 500))

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setShowHint(false)
    } else {
      setShowResults(true)
      toast("🏁 Session Complete! Analyze your performance below")
    }

    setSelectedAnswer(null)
    setIsChecking(false)
  }

  function handleRestart() {
    fetchQuestions()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white dark:from-black dark:to-zinc-900 flex items-center justify-center py-8 md:py-12">
        <div className="animate-pulse text-lg text-muted-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 animate-spin" />
          Preparing your questions...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white dark:from-black dark:to-zinc-900 flex flex-col items-center justify-center gap-4 py-8 md:py-12">
        <AlertCircle className="h-8 w-8 text-red-500 animate-bounce" />
        <p className="text-lg text-muted-foreground">{error}</p>
        <Button onClick={fetchQuestions} variant="outline" className="bg-white/5 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
          Try Again
        </Button>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white dark:from-black dark:to-zinc-900 py-8 md:py-12">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <QuizResults
              score={score}
              totalQuestions={questions.length}
              correctAnswers={correctAnswers}
              wrongAnswers={wrongAnswers}
              onRetry={handleRestart}
            />
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const currentAnswers = questionAnswers[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white dark:from-black dark:to-zinc-900">
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="bg-white/5 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 text-transparent bg-clip-text">
                  English Grammar
                </h1>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <Progress value={progress} className="w-[200px] bg-zinc-200 dark:bg-zinc-800" />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr,300px]">
            <Card className="backdrop-blur-sm bg-white/5 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                      {currentQuestionIndex + 1}
                    </div>
                    <CardTitle className="text-2xl">Grammar Question</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800">
                      Grade {String(currentQuestion.grade)}
                    </span>
                    <DifficultyBadge difficulty={currentQuestion.difficulty} />
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-xl bg-gradient-to-br from-zinc-100/80 to-white/80 dark:from-zinc-900/80 dark:to-zinc-800/80 p-6 shadow-inner border border-zinc-200 dark:border-zinc-700">
                  <p className="text-xl font-medium">{currentQuestion.question}</p>
                  {showHint && (
                    <div className="mt-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 p-4 border border-violet-200 dark:border-violet-900">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-violet-500" />
                        {currentQuestion.hint}
                      </p>
                    </div>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {currentAnswers.map((answer, index) => {
                    const isSelected = selectedAnswer === answer
                    const isCorrect = answer === currentQuestion.correct_answer
                    let buttonStyle = "bg-white/5 hover:bg-white/10 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800"
                    
                    if (isSelected && isChecking) {
                      buttonStyle = isCorrect 
                        ? "bg-green-500/20 border-green-500 text-green-500 hover:bg-green-500/30" 
                        : "bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30"
                    } else if (isChecking && isCorrect) {
                      buttonStyle = "bg-green-500/20 border-green-500 text-green-500 hover:bg-green-500/30"
                    }

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={`h-14 text-lg font-medium transition-all duration-200 rounded-xl ${buttonStyle}`}
                        onClick={() => handleAnswer(answer)}
                        disabled={isChecking}
                      >
                        {answer}
                      </Button>
                    )
                  })}
                </div>
                {!showHint && !isChecking && (
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 hover:from-violet-500/20 hover:to-indigo-500/20 border-violet-200 dark:border-violet-900 rounded-xl"
                    onClick={() => setShowHint(true)}
                  >
                    <HelpCircle className="mr-2 h-4 w-4 text-violet-500" />
                    <span className="text-violet-700 dark:text-violet-300">Show Hint</span>
                  </Button>
                )}
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="backdrop-blur-sm bg-white/5 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl">
                <CardContent className="pt-6">
                  <Scoreboard
                    score={score}
                    streak={streak}
                    correctAnswers={correctAnswers}
                    wrongAnswers={wrongAnswers}
                    grade={String(currentQuestion.grade)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
