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
  Chrome,
  AlertCircle,
} from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const { signIn, isLoading, error } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await signIn({ email, password })
      router.push("/practice")
    } catch (err: any) {
      setFormError(err.message || "An error occurred")
    }
  }

  // Remove handleGoogleSignIn function

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900">
      <div className="container flex items-center justify-center min-h-screen py-8 md:py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="bg-white/5 backdrop-blur-sm border-zinc-200/20 dark:border-zinc-800/20 hover:bg-white/10">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3 mb-8 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20">
              <GraduationCap className="w-10 h-10 text-violet-500" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-zinc-400">
              Sign in to continue your learning journey
            </p>
          </div>

          {(error || formError) && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
              <AlertCircle className="h-4 w-4" />
              <p>{error || formError}</p>
            </div>
          )}

          <Card className="backdrop-blur-sm bg-white/5 dark:bg-zinc-900/50 border-zinc-200/20 dark:border-zinc-800/20 shadow-2xl rounded-2xl">
            <CardHeader className="space-y-1 px-6 pt-6">
              <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
              <CardDescription>
                Sign in with your email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    className="bg-white/5 border-zinc-200/20 dark:border-zinc-800/20 focus:border-violet-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="bg-white/5 border-zinc-200/20 dark:border-zinc-800/20 focus:border-violet-500/50 transition-colors"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in with Email"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}