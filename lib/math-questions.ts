"use client"

import { Difficulty } from "@/types/questions"

interface MathQuestion {
  question: string
  correct_answer: string
  incorrect_answers: string[]
  difficulty: Difficulty
  grade: number
  hint: string
}

function generateBasicQuestion(grade: number): MathQuestion {
  if (typeof window === "undefined") {
    return {
      question: "Loading...",
      correct_answer: "0",
      incorrect_answers: ["0", "0", "0"],
      difficulty: "easy",
      grade: 1,
      hint: "Loading..."
    }
  }

  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  const operations = ["+", "-", "×", "÷"]
  const operation = operations[Math.floor(Math.random() * operations.length)]
  
  let answer: number
  let hint: string

  switch (operation) {
    case "+":
      answer = num1 + num2
      hint = "Add the numbers together"
      break
    case "-":
      answer = num1 - num2
      hint = "Subtract the second number from the first"
      break
    case "×":
      answer = num1 * num2
      hint = "Multiply the numbers together"
      break
    case "÷":
      answer = num1
      hint = "Divide the numbers"
      break
    default:
      answer = num1 + num2
      hint = "Add the numbers together"
  }

  const incorrect = [
    answer + 1,
    answer - 1,
    answer + 2
  ].map(n => n.toString())

  return {
    question: `${num1} ${operation} ${num2} = ?`,
    correct_answer: answer.toString(),
    incorrect_answers: incorrect,
    difficulty: "easy",
    grade: grade,
    hint
  }
}

export function generateMathQuestions(count: number = 10): MathQuestion[] {
  if (typeof window === "undefined") {
    return Array(count).fill({
      question: "Loading...",
      correct_answer: "0",
      incorrect_answers: ["0", "0", "0"],
      difficulty: "easy",
      grade: 1,
      hint: "Loading..."
    })
  }

  const questions: MathQuestion[] = []
  
  for (let i = 0; i < count; i++) {
    const grade = Math.floor(Math.random() * 6) + 1 // Grades 1-6 only
    questions.push(generateBasicQuestion(grade))
  }
  
  return questions
} 