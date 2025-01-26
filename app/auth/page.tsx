"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { 
  ArrowLeft, 
  GraduationCap, 
  Mail, 
  Lock, 
  User,
  Trophy,
  Sparkles,
  AlertCircle,
  LogIn,
  Loader2
} from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const { signIn, signUp, isLoading, error } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    try {
      if (isSignUp) {
        await signUp({ email, password, name })
      } else {
        await signIn({ email, password })
      }
      router.push("/practice")
    } catch (err: any) {
      if (Array.isArray(err)) {
        // Handle Zod validation errors
        const messages = err.map(e => e.message).join(", ")
        setFormError(messages)
      } else {
        setFormError(err.message || "An error occurred")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900">
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-md space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="bg-white/5 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-2 mb-8 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20">
              <GraduationCap className="w-8 h-8 text-violet-500" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-zinc-400">
              {isSignUp 
                ? "Join our community of learners" 
                : "Sign in to continue your learning journey"}
            </p>
          </div>

          {(error || formError) && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" />
              <p>{error || formError}</p>
            </div>
          )}

          <Card className="backdrop-blur-sm bg-white/5 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl p-6">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                {isSignUp ? "Create an account" : "Sign in"}
              </CardTitle>
              <CardDescription>
                {isSignUp 
                  ? "Enter your details to create your account" 
                  : "Enter your credentials to access your account"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                      minLength={2}
                      maxLength={50}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    onFocus={() => setShowPasswordRequirements(true)}
                  />
                  {isSignUp && showPasswordRequirements && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Password must:</p>
                      <ul className="list-inside list-disc space-y-1">
                        <li>Be at least 8 characters long</li>
                        <li>Contain at least one uppercase letter</li>
                        <li>Contain at least one lowercase letter</li>
                        <li>Contain at least one number</li>
                        <li>Contain at least one special character (!@#$%^&*)</li>
                      </ul>
                    </div>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isSignUp ? "Creating account..." : "Signing in..."}
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      {isSignUp ? "Create account" : "Sign in"}
                    </>
                  )}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setFormError(null)
                  }}
                  className="text-primary hover:underline"
                >
                  {isSignUp 
                    ? "Already have an account? Sign in" 
                    : "Don't have an account? Sign up"}
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="backdrop-blur-sm bg-white/5 dark:bg-zinc-900/50 border-zinc-800 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-violet-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white">Compete Online</h3>
                  <p className="text-xs text-zinc-400">Challenge other students in real-time competitions</p>
                </div>
              </div>
            </Card>
            <Card className="backdrop-blur-sm bg-white/5 dark:bg-zinc-900/50 border-zinc-800 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white">Track Progress</h3>
                  <p className="text-xs text-zinc-400">Monitor your learning journey and achievements</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 