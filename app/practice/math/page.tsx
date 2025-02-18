"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calculator, AlertCircle, HelpCircle, Sparkles } from "lucide-react"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { QuizResults } from "@/components/quiz-results"
import { Scoreboard } from "@/components/scoreboard"
import { Difficulty } from "@/types/questions"
import { generateMathQuestions } from "@/lib/math-questions"
import { calculateGrade } from '@/utils/grade';

interface Question {
  question: string
  correct_answer: string
  incorrect_answers: string[]
  difficulty: Difficulty
  grade: number
  hint: string
}

export default function MathPracticePage() {
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
      const newQuestions = generateMathQuestions(10)
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
    } else {
      setStreak(0)
      setWrongAnswers(prev => prev + 1)
    }

    setIsChecking(false)
    setShowHint(false)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
    } else {
      setShowResults(true)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Calculator className="mx-auto mb-4 h-12 w-12 animate-pulse text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">Loading questions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
                <h2 className="mb-2 text-lg font-medium text-foreground">{error}</h2>
                <Button onClick={fetchQuestions}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  const totalQuestions = correctAnswers + wrongAnswers; 
  const grade = calculateGrade(score);
  return (
    <div>
      <QuizResults
        score={score}
        totalQuestions={totalQuestions}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        onRetry={fetchQuestions}
      />
      <Scoreboard
        score={score}
        streak={streak}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        grade={grade}
      />
    </div>
  );
}
