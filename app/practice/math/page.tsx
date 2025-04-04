"use client";

import { useState, useEffect } from 'react';
// Use the supabase client that has proper error handling for client components
import { supabase } from '@/lib/supabase';
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
  const [showResults, setShowResults] = useState(false) // Make sure this is false initially
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

  async function fetchQuestions() {
    try {
      setIsLoading(true)
      setError("")
      
      // Single Supabase query
      const { data: questions, error: queryError } = await supabase
        .from('questions')
        .select('*')
        .eq('subject', 'math')
        .limit(10);
      
      console.log("Supabase response:", { data: questions, error: queryError })
      
      if (queryError) {
        console.error("Database error:", queryError)
        throw new Error(`Failed to load questions: ${queryError.message}`)
      }
      
      if (!questions || questions.length === 0) {
        console.log("No questions found in database, using generated questions")
        const generatedQuestions = generateMathQuestions(10)
        setQuestions(generatedQuestions)
        
        // Pre-generate all shuffled answers for generated questions
        const shuffledAnswers = generatedQuestions.map(q => 
          shuffleAnswers(q.correct_answer, q.incorrect_answers)
        )
        setQuestionAnswers(shuffledAnswers)
        
        // Reset state
        setCurrentQuestionIndex(0)
        setScore(0)
        setStreak(0)
        setCorrectAnswers(0)
        setWrongAnswers(0)
        setShowResults(false)
        setShowHint(false)
        setSelectedAnswer(null)
        setIsChecking(false)
        return
      }
      
      // Format Supabase questions
      const newQuestions = questions.map(q => {
        let incorrectAnswers = []
        try {
          if (Array.isArray(q.incorrect_answers)) {
            incorrectAnswers = q.incorrect_answers
          } else if (typeof q.incorrect_answers === 'string') {
            // Handle escaped JSON strings
            incorrectAnswers = JSON.parse(q.incorrect_answers.replace(/\\"/g, '"'))
          }
        } catch (parseError) {
          console.error("Parsing error:", parseError)
          incorrectAnswers = []
        }

        return {
          id: q.id,
          question: q.question || q.text,
          correct_answer: q.correct_answer || q.correctAnswer,
          incorrect_answers: incorrectAnswers,
          difficulty: q.difficulty || 'medium',
          grade: Number(q.grade) || 5,
          hint: q.hint || "Think about the mathematical principles involved.",
          subject: "math"
        }
      })
      
      setQuestions(newQuestions)
      
      // Pre-generate all shuffled answers
      const shuffledAnswers = newQuestions.map(q => 
        shuffleAnswers(q.correct_answer, q.incorrect_answers)
      )
      setQuestionAnswers(shuffledAnswers)
      
      // Reset state
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
      console.error("Error fetching questions:", err)
      setError(`Failed to load questions: ${err instanceof Error ? err.message : 'Unknown error'}`)
      
      // Fallback to generated questions on error
      const generatedQuestions = generateMathQuestions(10)
      setQuestions(generatedQuestions)
      
      // Pre-generate all shuffled answers
      const shuffledAnswers = generatedQuestions.map(q => 
        shuffleAnswers(q.correct_answer, q.incorrect_answers)
      )
      setQuestionAnswers(shuffledAnswers)
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

    // Add delay before moving to next question
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setIsChecking(false)
      setShowHint(false)
    } else {
      setShowResults(true)
      setIsChecking(false)
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
              onRetry={fetchQuestions}
            />
          </div>
        </div>
      </div>
    )
  }

  // Only show the quiz UI if we have questions and aren't showing results
  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const currentAnswers = questionAnswers[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white dark:from-black dark:to-zinc-900">
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="bg-white/5 backdrop-blur-sm border-zinc-200/20 dark:border-zinc-800/20 hover:bg-white/10">
                <Link href="/practice" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-2xl border border-zinc-200/20 dark:border-zinc-800/20">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 text-transparent bg-clip-text">
                  Mathematics
                </h1>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-zinc-200/20 dark:border-zinc-800/20">
              <Progress value={progress} className="w-[200px] bg-zinc-200/20 dark:bg-zinc-800/20" />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr,300px]">
            <Card className="backdrop-blur-sm bg-white/5 dark:bg-zinc-900/50 border-zinc-200/20 dark:border-zinc-800/20 shadow-2xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                      {currentQuestionIndex + 1}
                    </div>
                    <CardTitle className="text-2xl">Math Question</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block px-2 py-1 rounded-md bg-zinc-100/20 dark:bg-zinc-800/20">
                      Grade {String(currentQuestion.grade)}
                    </span>
                    <DifficultyBadge difficulty={currentQuestion.difficulty} />
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-xl bg-gradient-to-br from-zinc-100/80 to-white/80 dark:from-zinc-900/80 dark:to-zinc-800/80 p-6 shadow-inner border border-zinc-200/20 dark:border-zinc-700/20">
                  <p className="text-xl font-medium">{currentQuestion.question}</p>
                  {showHint && (
                    <div className="mt-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 p-4 border border-violet-200/20 dark:border-violet-900/20">
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
                    const isWrong = isSelected && !isCorrect
                    
                    return (
                      <Button
                        key={index}
                        variant={isSelected ? (isCorrect ? "default" : "destructive") : "outline"}
                        className={`h-auto py-4 px-6 justify-start text-left ${
                          isSelected && isCorrect ? "bg-green-500 hover:bg-green-500" : ""
                        } ${
                          isWrong ? "bg-red-500 hover:bg-red-500" : ""
                        }`}
                        onClick={() => handleAnswer(answer)}
                        disabled={isChecking || selectedAnswer !== null}
                      >
                        <span className="text-lg">{answer}</span>
                      </Button>
                    )
                  })}
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => setShowHint(!showHint)}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Scoreboard
                score={score}
                streak={streak}
                correctAnswers={correctAnswers}
                wrongAnswers={wrongAnswers}
                grade={calculateGrade(score)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
