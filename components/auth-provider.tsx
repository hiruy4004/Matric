"use client"

import React from "react"
import { AuthContextType, SignInData, SignUpData, User } from "@/types/auth"
import { signIn, signOut, signUp, getUser, getUserProfile, updateUserProfile } from "@/lib/auth"

const AuthContext = React.createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [profile, setProfile] = React.useState<any | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Check for existing session
  React.useEffect(() => {
    const currentUser = getUser()
    if (currentUser) {
      setUser(currentUser)
      const userProfile = getUserProfile(currentUser.id)
      if (userProfile) {
        setProfile(userProfile)
      }
    }
    setIsLoading(false)
  }, [])

  const handleSignIn = async (data: SignInData) => {
    try {
      setIsLoading(true)
      setError(null)
      const user = await signIn(data)
      setUser(user)
      const userProfile = getUserProfile(user.id)
      if (userProfile) {
        setProfile(userProfile)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (data: SignUpData) => {
    try {
      setIsLoading(true)
      setError(null)
      const user = await signUp(data)
      setUser(user)
      const userProfile = getUserProfile(user.id)
      if (userProfile) {
        setProfile(userProfile)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await signOut()
      setUser(null)
      setProfile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign out")
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = (updates: Partial<any>) => {
    if (profile && user) {
      const updatedProfile = { ...profile, ...updates }
      updateUserProfile(updatedProfile)
      setProfile(updatedProfile)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        error,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
} 