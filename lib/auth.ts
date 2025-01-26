"use client"

import { SignInData, SignUpData, User } from "@/types/auth"
import { signInSchema, signUpSchema } from "@/lib/validations/auth"
import { rateLimiter, isSessionExpired, isStrongPassword, generateCSRFToken, validateCSRFToken } from "@/lib/security"

// Mock storage keys
const USERS_STORAGE_KEY = "stored_users"
const CURRENT_USER_KEY = "current_user"
const USER_PROFILES_KEY = "user_profiles"

interface StoredUser extends User {
  password: string
  createdAt: string
  emailVerified: boolean
  lastLoginTime?: number
  loginAttempts: number
  lockedUntil?: number
}

interface UserProfile {
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

// Helper functions for local storage
function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem(USERS_STORAGE_KEY)
  return users ? JSON.parse(users) : []
}

function setStoredUsers(users: StoredUser[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

function getUserProfiles(): UserProfile[] {
  if (typeof window === "undefined") return []
  const profiles = localStorage.getItem(USER_PROFILES_KEY)
  return profiles ? JSON.parse(profiles) : []
}

function setUserProfiles(profiles: UserProfile[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(profiles))
}

// Create initial profile for new user
function createUserProfile(user: User): UserProfile {
  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    level: 1,
    xp: 0,
    streak: 0,
    questionsAnswered: 0,
    achievements: [],
    subjects: {
      math: { progress: 0, score: 0 },
      english: { progress: 0, score: 0 },
      science: { progress: 0, score: 0 },
      history: { progress: 0, score: 0 }
    },
    joinedAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  }
}

// Auth functions
export async function signUp({ email, password, name }: SignUpData): Promise<User> {
  if (typeof window === "undefined") {
    throw new Error("Cannot sign up on server side")
  }

  // Validate input
  const validatedData = signUpSchema.parse({ email, password, name })
  
  // Check password strength
  if (!isStrongPassword(validatedData.password)) {
    throw new Error("Password does not meet security requirements")
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const users = getStoredUsers()
  
  // Check if user already exists
  if (users.some(user => user.email === email)) {
    throw new Error("User already exists")
  }

  // Create new user
  const newUser: StoredUser = {
    id: Math.random().toString(36).slice(2),
    email: validatedData.email,
    name: validatedData.name,
    password: validatedData.password, // Store password as-is for demo
    createdAt: new Date().toISOString(),
    emailVerified: false,
    loginAttempts: 0
  }

  // Create user profile
  const newProfile = createUserProfile(newUser)

  // Store user and profile
  const profiles = getUserProfiles()
  profiles.push(newProfile)
  setUserProfiles(profiles)

  users.push(newUser)
  setStoredUsers(users)

  // Generate CSRF token
  generateCSRFToken()

  // Set current user (excluding password)
  const { password: _, emailVerified, loginAttempts, lockedUntil, ...user } = newUser
  const userWithDate = {
    ...user,
    createdAt: new Date(user.createdAt)
  }
  
  setCurrentUser(userWithDate)
  return userWithDate
}

export async function signIn({ email, password }: SignInData): Promise<User> {
  if (typeof window === "undefined") {
    throw new Error("Cannot sign in on server side")
  }

  // Validate input
  const validatedData = signInSchema.parse({ email, password })
  
  // Check rate limit
  if (!rateLimiter.checkRateLimit(validatedData.email)) {
    const timeUntilReset = rateLimiter.getTimeUntilReset(validatedData.email)
    throw new Error(`Too many login attempts. Please try again in ${Math.ceil(timeUntilReset / 1000 / 60)} minutes`)
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const users = getStoredUsers()
  const user = users.find(u => u.email === validatedData.email && u.password === validatedData.password)
  
  if (!user) {
    throw new Error("Invalid email or password")
  }

  // Check if account is locked
  if (user.lockedUntil && Date.now() < user.lockedUntil) {
    const waitTime = Math.ceil((user.lockedUntil - Date.now()) / 1000 / 60)
    throw new Error(`Account is locked. Please try again in ${waitTime} minutes`)
  }

  // Reset login attempts on successful login
  user.loginAttempts = 0
  user.lockedUntil = undefined
  user.lastLoginTime = Date.now()
  users[users.findIndex(u => u.id === user.id)] = user
  setStoredUsers(users)

  // Set current user (excluding sensitive data)
  const { password: _, emailVerified, loginAttempts, lockedUntil, ...userWithoutPassword } = user
  const userWithDate = {
    ...userWithoutPassword,
    createdAt: new Date(user.createdAt)
  }
  
  setCurrentUser(userWithDate)
  return userWithDate
}

export async function signOut(): Promise<void> {
  if (typeof window === "undefined") return
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  setCurrentUser(null)
}

export function getUser(): User | null {
  return getCurrentUser()
}

export function getUserProfile(userId: string): UserProfile | null {
  const profiles = getUserProfiles()
  return profiles.find(p => p.userId === userId) || null
}

export function updateUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return
  const profiles = getUserProfiles()
  const index = profiles.findIndex(p => p.userId === profile.userId)
  if (index !== -1) {
    profiles[index] = profile
    setUserProfiles(profiles)
  }
}

// Password reset functionality (mock implementation)
export async function requestPasswordReset(email: string): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Cannot request password reset on server side")
  }

  // Check rate limit for password reset requests
  if (!rateLimiter.checkRateLimit(`reset_${email}`)) {
    const timeUntilReset = rateLimiter.getTimeUntilReset(`reset_${email}`)
    throw new Error(`Too many password reset attempts. Please try again in ${Math.ceil(timeUntilReset / 1000 / 60)} minutes`)
  }

  const users = getStoredUsers()
  const user = users.find(u => u.email === email)

  if (!user) {
    // In a real app, you might want to return success even if user doesn't exist
    // to prevent email enumeration
    throw new Error("If an account exists with this email, you will receive a password reset link")
  }

  console.log("Password reset requested for:", email)
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Cannot reset password on server side")
  }

  // Validate CSRF token
  if (!validateCSRFToken(token)) {
    throw new Error("Invalid or expired token")
  }

  // Check password strength
  if (!isStrongPassword(newPassword)) {
    throw new Error("Password does not meet security requirements")
  }

  console.log("Password reset with token:", token)
} 