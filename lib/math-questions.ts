"use client"

import { Difficulty } from "@/types/questions"
// MathQuestion is already defined locally, no need to import
import { mathQuestions } from "@/data/math-questions";

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

  // Ensure count is at least 10
  count = Math.max(count, 10);

  // Use predefined questions if available, otherwise generate basic ones
  if (mathQuestions && Array.isArray(mathQuestions) && mathQuestions.length > 0) {
    // Properly shuffle and map questions
    const shuffled = [...mathQuestions].sort(() => Math.random() - 0.5);
    
    // If we don't have enough predefined questions, generate additional ones
    let result = shuffled.slice(0, Math.min(count, shuffled.length)).map(question => ({
      question: question.text,
      correct_answer: question.correctAnswer,
      incorrect_answers: shuffleArray(question.options.filter(opt => opt !== question.correctAnswer)),
      difficulty: question.difficulty as Difficulty || calculateDifficulty(question.grade || 1),
      grade: typeof question.grade === 'number' ? question.grade : 1, // Ensure grade is a number, default to 1
      hint: question.explanation || "Think about the problem carefully"
    }));
    
    // If we need more questions, generate them
    if (result.length < count) {
      const additionalCount = count - result.length;
      for (let i = 0; i < additionalCount; i++) {
        const grade = Math.floor(Math.random() * 6) + 1; // Grades 1-6 only
        result.push(generateBasicQuestion(grade));
      }
    }
    
    return result;
  } else {
    // Fallback to generating basic questions
    const questions: MathQuestion[] = []
    for (let i = 0; i < count; i++) {
      const grade = Math.floor(Math.random() * 6) + 1 // Grades 1-6 only
      questions.push(generateBasicQuestion(grade))
    }
    return questions
  }
}

function shuffleArray(array: any[]) {
  return array.sort(() => Math.random() - 0.5);
}

function calculateDifficulty(grade: number): Difficulty {
  return grade <= 3 ? 'easy' : grade <= 6 ? 'medium' : 'hard';
}