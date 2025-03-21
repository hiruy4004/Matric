export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: string
  difficulty: Difficulty
  explanation: string
}

export interface MathQuestion extends Question {
  grade: any
  grade: number
  category: 'multiplication' | 'division' | 'algebra' | 'geometry'
}

export interface EnglishQuestion extends Question {
  grade: number
  grade: any
  category: 'grammar' | 'vocabulary' | 'comprehension' | 'spelling'
} 