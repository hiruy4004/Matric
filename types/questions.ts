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
  category: 'multiplication' | 'division' | 'algebra' | 'geometry'
}

export interface EnglishQuestion extends Question {
  category: 'grammar' | 'vocabulary' | 'comprehension' | 'spelling'
} 