export interface User {
  id: string
  email: string
  name: string
}

export interface UserProfile {
  userId: string
  name: string
  email: string
  level: number
  xp: number
  streak: number
  questionsAnswered: number
  achievements: string[]
  subjects: {
    math: { progress: number, score: number }
    english: { progress: number, score: number }
    science: { progress: number, score: number }
    history: { progress: number, score: number }
  }
  joinedAt: string
  lastActive: string
}

export interface AuthState {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
}

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthContextType extends AuthState {
  signIn: (data: SignInData) => Promise<void>
  signUp: (data: SignUpData) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => void
} 