"use client"

import { supabase } from './supabase'
import { SignInData, SignUpData, User, UserProfile } from "@/types/auth"
import { signInSchema, signUpSchema } from "@/lib/validations/auth"
import { isStrongPassword } from "@/lib/security"

export async function signIn(email: string, password: string) {
  try {
    // Validate input
    const validatedData = signInSchema.parse({ email, password })

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })
    
    if (error) throw error
    return data.user
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

export async function signUp(email: string, password: string, name: string) {
  // Validate input
  const validatedData = signUpSchema.parse({ email, password, name })
  
  if (!isStrongPassword(validatedData.password)) {
    throw new Error("Password does not meet security requirements")
  }

  const { data, error } = await supabase.auth.signUp({
    email: validatedData.email,
    password: validatedData.password,
    options: {
      data: {
        name: validatedData.name
      }
    }
  })
  
  if (error) throw error
  return data
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
    
  if (error) return null
  return data
}

export async function updateUserProfile(profile: Partial<UserProfile>): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('user_id', profile.userId)
    
  if (error) throw error
}

export async function requestPasswordReset(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
}