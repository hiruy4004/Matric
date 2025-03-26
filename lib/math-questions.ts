import { MathQuestion, Difficulty } from '@/types/questions'

function generateBasicQuestion(grade: number): MathQuestion {
  const operations = ['+', '-', '*', '/']
  const operation = operations[Math.floor(Math.random() * operations.length)]
  let num1: number, num2: number, answer: number

  // Adjust number ranges based on grade level
  const maxNum = grade <= 2 ? 10 : grade <= 4 ? 20 : 50
  
  switch (operation) {
    case '+':
      num1 = Math.floor(Math.random() * maxNum) + 1
      num2 = Math.floor(Math.random() * maxNum) + 1
      answer = num1 + num2
      break
    case '-':
      num1 = Math.floor(Math.random() * maxNum) + Math.ceil(maxNum/2) // Ensure larger first number
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1 // Ensure positive result
      answer = num1 - num2
      break
    case '*':
      // Use smaller numbers for multiplication based on grade
      const multFactor = grade <= 2 ? 5 : grade <= 4 ? 10 : 12
      num1 = Math.floor(Math.random() * multFactor) + 1
      num2 = Math.floor(Math.random() * multFactor) + 1
      answer = num1 * num2
      break
    case '/':
      // Use smaller divisors and ensure clean division
      num2 = Math.floor(Math.random() * Math.min(grade + 2, 10)) + 1
      // For lower grades, keep quotients small
      const maxQuotient = grade <= 2 ? 5 : grade <= 4 ? 10 : 12
      answer = Math.floor(Math.random() * maxQuotient) + 1
      num1 = num2 * answer // Ensure clean division
      break
    default:
      num1 = 1
      num2 = 1
      answer = 2
  }

  // Generate more realistic incorrect answers
  const incorrect_answers = new Set<string>()
  while (incorrect_answers.size < 3) {
    let wrongAnswer: number
    
    // Common mistake patterns
    const mistakes = [
      answer + 1, // Off by one
      answer - 1,
      operation === '*' ? num1 + num2 : null, // Adding instead of multiplying
      operation === '+' ? num1 * num2 : null, // Multiplying instead of adding
      operation === '/' ? num1 - num2 : null, // Subtracting instead of dividing
      operation === '-' ? num1 + num2 : null, // Adding instead of subtracting
    ].filter(x => x !== null && x !== answer && x > 0)

    if (mistakes.length > 0 && Math.random() < 0.7) {
      // 70% chance to use common mistake patterns
      wrongAnswer = mistakes[Math.floor(Math.random() * mistakes.length)] ?? (answer + 1)
    } else {
      // Random wrong answer within reasonable range
      const variance = Math.max(Math.floor(answer * 0.5), 3)
      wrongAnswer = answer + (Math.random() < 0.5 ? 1 : -1) * Math.floor(Math.random() * variance + 1)
    }

    if (wrongAnswer > 0 && wrongAnswer !== answer) {
      incorrect_answers.add(wrongAnswer.toString())
    }
  }

  const difficulty: Difficulty = grade <= 2 ? 'easy' : grade <= 4 ? 'medium' : 'hard'

  return {
    question: `What is ${num1} ${operation} ${num2}?`,
    correct_answer: answer.toString(),
    incorrect_answers: Array.from(incorrect_answers),
    difficulty, // Use the defined difficulty constant
    grade,
    hint: `Try breaking down the ${operation === '*' ? 'multiplication' :
      operation === '/' ? 'division' :
        operation === '+' ? 'addition' : 'subtraction'} step by step.`,
    category: 'arithmetic',
    subject: 'math'
  } as unknown as MathQuestion // Add type assertion
}

export function generateMathQuestions(count: number = 10): MathQuestion[] {
  const questions: MathQuestion[] = []
  for (let i = 0; i < count; i++) {
    const grade = Math.floor(Math.random() * 6) + 1 // Grades 1-6 only
    questions.push(generateBasicQuestion(grade))
  }
  return questions
}