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

// Helper function to format numbers (keep decimals to 2 places, remove .0 for whole numbers)
function formatNumber(num: number): string {
  return Number.isInteger(num) ? num.toString() : num.toFixed(2)
}

// Helper function to generate incorrect answers that are close but not equal to the correct answer
function generateIncorrectAnswers(correctAnswer: number, range: number = 5, count: number = 3): string[] {
  if (typeof window === "undefined") {
    return Array(count).fill("0")
  }

  const answers = new Set<string>()
  let attempts = 0
  const maxAttempts = 20

  while (answers.size < count && attempts < maxAttempts) {
    attempts++
    const offset = Math.floor(Math.random() * range) + 1
    const isAdd = Math.random() < 0.5
    const wrongAnswer = isAdd ? correctAnswer + offset : correctAnswer - offset
    
    // Ensure answers are positive and different from correct answer
    if (wrongAnswer > 0 && wrongAnswer !== correctAnswer) {
      answers.add(formatNumber(wrongAnswer))
    }
  }

  // If we couldn't generate enough unique answers, add some default ones
  while (answers.size < count) {
    answers.add(formatNumber(correctAnswer + answers.size + 1))
  }

  return Array.from(answers)
}

const gradeConfigs = {
  // Grades 1-2: Basic addition and subtraction
  elementary1: {
    operations: ["+", "-"],
    maxNumber: 20,
    allowNegatives: false,
    decimals: false
  },
  // Grades 3-4: Multiplication and division
  elementary2: {
    operations: ["+", "-", "*", "/"],
    maxNumber: 100,
    allowNegatives: false,
    decimals: false
  },
  // Grades 5-6: Decimals and negative numbers
  intermediate1: {
    operations: ["+", "-", "*", "/"],
    maxNumber: 1000,
    allowNegatives: true,
    decimals: true
  },
  // Grades 7-8: Pre-algebra
  intermediate2: {
    operations: ["+", "-", "*", "/", "^"],
    maxNumber: 100,
    allowNegatives: true,
    decimals: true
  },
  // Grades 9-10: Algebra
  advanced1: {
    operations: ["+", "-", "*", "/", "^", "√"],
    maxNumber: 200,
    allowNegatives: true,
    decimals: true
  },
  // Grades 11-12: Advanced algebra
  advanced2: {
    operations: ["+", "-", "*", "/", "^", "√", "log"],
    maxNumber: 500,
    allowNegatives: true,
    decimals: true
  }
}

function getGradeConfig(grade: number) {
  if (grade <= 2) return gradeConfigs.elementary1
  if (grade <= 4) return gradeConfigs.elementary2
  if (grade <= 6) return gradeConfigs.intermediate1
  if (grade <= 8) return gradeConfigs.intermediate2
  if (grade <= 10) return gradeConfigs.advanced1
  return gradeConfigs.advanced2
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

  const config = getGradeConfig(grade)
  const operation = config.operations[Math.floor(Math.random() * config.operations.length)]
  
  let num1: number, num2: number, answer: number, question: string, hint: string

  do {
    num1 = Math.floor(Math.random() * config.maxNumber) + 1
    num2 = Math.floor(Math.random() * config.maxNumber) + 1

    if (config.decimals && Math.random() < 0.3) {
      num1 = num1 / (Math.floor(Math.random() * 9) + 1)
      num2 = num2 / (Math.floor(Math.random() * 9) + 1)
    }

    if (config.allowNegatives && Math.random() < 0.3) {
      if (Math.random() < 0.5) num1 = -num1
      if (Math.random() < 0.5) num2 = -num2
    }

    switch (operation) {
      case "+":
        answer = num1 + num2
        question = `${formatNumber(num1)} + ${formatNumber(num2)} = ?`
        hint = "Add the numbers together"
        break
      case "-":
        answer = num1 - num2
        question = `${formatNumber(num1)} - ${formatNumber(num2)} = ?`
        hint = "Subtract the second number from the first"
        break
      case "*":
        answer = num1 * num2
        question = `${formatNumber(num1)} × ${formatNumber(num2)} = ?`
        hint = "Multiply the numbers together"
        break
      case "/":
        // Ensure division results in a whole number or simple decimal
        num2 = Math.max(1, Math.abs(num2))
        num1 = num2 * Math.floor(Math.random() * 10 + 1)
        answer = num1 / num2
        question = `${formatNumber(num1)} ÷ ${formatNumber(num2)} = ?`
        hint = "Divide the first number by the second"
        break
      case "^":
        num2 = Math.min(4, Math.floor(Math.random() * 3) + 2) // Keep exponents reasonable
        answer = Math.pow(num1, num2)
        question = `${formatNumber(num1)}^${num2} = ?`
        hint = `Multiply ${formatNumber(num1)} by itself ${num2} times`
        break
      case "√":
        // Generate perfect squares/cubes for cleaner answers
        num2 = Math.min(3, Math.floor(Math.random() * 2) + 2)
        answer = num1
        num1 = Math.pow(num1, num2)
        question = `Find the ${num2 === 2 ? 'square' : 'cube'} root of ${formatNumber(num1)}`
        hint = `Find the number that, when multiplied by itself ${num2} times, equals ${formatNumber(num1)}`
        break
      case "log":
        // Use base 10 logarithms with nice numbers
        num1 = Math.pow(10, Math.floor(Math.random() * 3) + 1)
        answer = Math.log10(num1)
        question = `log₁₀(${formatNumber(num1)}) = ?`
        hint = "Find the power of 10 that equals this number"
        break
      default:
        answer = num1 + num2
        question = `${formatNumber(num1)} + ${formatNumber(num2)} = ?`
        hint = "Add the numbers together"
    }
  } while (!Number.isFinite(answer) || Math.abs(answer) > config.maxNumber * 10)

  return {
    question,
    correct_answer: formatNumber(answer),
    incorrect_answers: generateIncorrectAnswers(answer),
    difficulty: grade <= 4 ? "easy" : grade <= 8 ? "medium" : "hard",
    grade,
    hint
  }
}

function generateWordProblem(grade: number): MathQuestion {
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

  const config = getGradeConfig(grade)
  const templates = {
    elementary1: [
      {
        template: (num1: number, num2: number) => 
          `You have ${num1} marbles and find ${num2} more. How many marbles do you have now?`,
        operation: "+",
        hint: "Add the new marbles to what you had"
      },
      {
        template: (num1: number, num2: number) => 
          `If you have ${num1} stickers and give ${num2} to your friend, how many stickers do you have left?`,
        operation: "-",
        hint: "Subtract the stickers you gave away"
      }
    ],
    elementary2: [
      {
        template: (num1: number, num2: number) => 
          `A bakery makes ${num1} rows of cookies with ${num2} cookies in each row. How many cookies are there in total?`,
        operation: "*",
        hint: "Multiply rows by cookies per row"
      },
      {
        template: (num1: number, num2: number) => 
          `You need to put ${num1} candies into ${num2} party bags equally. How many candies go in each bag?`,
        operation: "/",
        hint: "Divide total candies by number of bags"
      }
    ],
    intermediate1: [
      {
        template: (num1: number, num2: number) => 
          `A recipe needs ${formatNumber(num1)} cups of flour. If you want to make ${num2} batches, how many cups of flour do you need?`,
        operation: "*",
        hint: "Multiply the cups needed by number of batches"
      },
      {
        template: (num1: number, num2: number) => 
          `You have $${formatNumber(num1)} to share among ${num2} people. How much does each person get?`,
        operation: "/",
        hint: "Divide the total money by number of people"
      }
    ],
    intermediate2: [
      {
        template: (num1: number, num2: number) => 
          `A square garden has an area of ${num1} square meters. What is the length of each side?`,
        operation: "√",
        hint: "Find the square root of the area"
      },
      {
        template: (num1: number, num2: number) => 
          `If a number doubles ${num2} times starting from ${num1}, what is the final number?`,
        operation: "^",
        hint: `Multiply ${num1} by 2, ${num2} times`
      }
    ],
    advanced1: [
      {
        template: (num1: number, num2: number) => 
          `The area of a cube is ${num1} cubic units. What is the length of each edge?`,
        operation: "∛",
        hint: "Find the cube root of the volume"
      },
      {
        template: (num1: number, num2: number) => 
          `A population of ${num1} bacteria doubles every hour. How many bacteria will there be after ${num2} hours?`,
        operation: "^",
        hint: `Multiply ${num1} by 2 raised to the power of ${num2}`
      }
    ],
    advanced2: [
      {
        template: (num1: number) => 
          `A quantity increases from 1 to ${formatNumber(num1)} on a logarithmic scale. What is the log base 10 of the final quantity?`,
        operation: "log",
        hint: "Find the power of 10 that equals this number"
      },
      {
        template: (num1: number, num2: number) => 
          `If an investment of $${formatNumber(num1)} grows at ${num2}% compound interest annually, what will it be worth after 1 year?`,
        operation: "*",
        hint: `Multiply ${formatNumber(num1)} by (1 + ${num2}/100)`
      }
    ]
  }

  const level = getGradeConfig(grade) === gradeConfigs.elementary1 ? "elementary1" :
                getGradeConfig(grade) === gradeConfigs.elementary2 ? "elementary2" :
                getGradeConfig(grade) === gradeConfigs.intermediate1 ? "intermediate1" :
                getGradeConfig(grade) === gradeConfigs.intermediate2 ? "intermediate2" :
                getGradeConfig(grade) === gradeConfigs.advanced1 ? "advanced1" : "advanced2"

  const levelTemplates = templates[level]
  const template = levelTemplates[Math.floor(Math.random() * levelTemplates.length)]
  
  let num1 = Math.floor(Math.random() * config.maxNumber) + 1
  let num2 = Math.floor(Math.random() * config.maxNumber) + 1
  let answer: number

  // Adjust numbers based on operation
  switch (template.operation) {
    case "+":
      answer = num1 + num2
      break
    case "-":
      // Ensure positive result
      if (num2 > num1) [num1, num2] = [num2, num1]
      answer = num1 - num2
      break
    case "*":
      // Keep multiplication manageable
      num1 = Math.min(num1, 20)
      num2 = Math.min(num2, 12)
      answer = num1 * num2
      break
    case "/":
      // Ensure clean division
      num2 = Math.max(1, Math.min(10, num2))
      num1 = num2 * Math.floor(Math.random() * 10 + 1)
      answer = num1 / num2
      break
    case "^":
      num1 = Math.min(num1, 10) // Keep base small
      num2 = Math.min(num2, 4)  // Keep exponent reasonable
      answer = Math.pow(num1, num2)
      break
    case "√":
      answer = Math.floor(Math.sqrt(num1))
      num1 = answer * answer // Perfect square
      break
    case "∛":
      answer = Math.floor(Math.cbrt(num1))
      num1 = answer * answer * answer // Perfect cube
      break
    case "log":
      num1 = Math.pow(10, Math.floor(Math.random() * 3) + 1)
      answer = Math.log10(num1)
      break
    default:
      answer = num1 + num2
  }

  // Format question based on template
  const question = template.operation === "log" ? 
    template.template(num1) : 
    template.template(num1, num2)

  return {
    question,
    correct_answer: formatNumber(answer),
    incorrect_answers: generateIncorrectAnswers(answer),
    difficulty: grade <= 4 ? "easy" : grade <= 8 ? "medium" : "hard",
    grade,
    hint: template.hint
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
    const grade = Math.floor(Math.random() * 12) + 1
    const isWordProblem = Math.random() < 0.3 // 30% word problems
    
    try {
      questions.push(
        isWordProblem ? generateWordProblem(grade) : generateBasicQuestion(grade)
      )
    } catch (error) {
      // Fallback question if generation fails
      questions.push({
        question: "What is 5 + 3?",
        correct_answer: "8",
        incorrect_answers: ["6", "7", "9"],
        difficulty: "easy",
        grade: 1,
        hint: "Count up from 5: 6, 7, 8"
      })
    }
  }
  
  return questions
} 