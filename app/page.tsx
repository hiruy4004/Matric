"use client"

import Link from "next/link"
import Image from "next/image" // Add this import
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  BookOpen, 
  Calculator, 
  ChevronRight, 
  GraduationCap, 
  Trophy,
  Brain,
  Target,
  Sparkles,
  Star,
  Users,
  CheckCircle,
  Clock,
  Github,
  Quote,
  LogIn,
  ArrowRight // Add this import
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900">
      {/* Navigation */}
      <div className="container">
        <div className="flex items-center justify-between py-4">
          <div></div> {/* Empty div for flex spacing */}
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm" className="group rounded-full px-4 py-2 border-zinc-700 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300">
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="container relative">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="animate-float">
              <div className="inline-flex items-center justify-center p-2 mb-8 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20">
                <GraduationCap className="w-12 h-12 text-violet-500" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent pb-2">
              Master Your Skills
            </h1>
            <p className="mt-4 text-lg md:text-xl text-zinc-400 max-w-2xl">
              Interactive practice sessions designed to help you excel in Mathematics and English Grammar
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="group relative overflow-hidden rounded-full px-8 py-6 bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  // Simpler approach - just navigate directly without auth check
                  window.location.href = '/practice/math';
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                </div>
                <span className="relative flex items-center gap-2 text-lg font-semibold">
                  Start Math Practice
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              <Link href="/practice/english">
                <Button size="lg" variant="outline" className="group rounded-full px-8 py-6 border-zinc-700 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300">
                  <span className="flex items-center gap-2 text-lg font-semibold">
                    Start English Practice
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group relative overflow-hidden p-6 bg-zinc-900/50 border-zinc-800 hover:border-violet-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-violet-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Adaptive Learning</h3>
              <p className="text-zinc-400">Questions adapt to your skill level, ensuring optimal learning progress</p>
            </div>
          </Card>

          <Card className="group relative overflow-hidden p-6 bg-zinc-900/50 border-zinc-800 hover:border-violet-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-violet-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Track Progress</h3>
              <p className="text-zinc-400">Monitor your improvement with detailed performance analytics</p>
            </div>
          </Card>

          <Card className="group relative overflow-hidden p-6 bg-zinc-900/50 border-zinc-800 hover:border-violet-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-violet-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Earn Rewards</h3>
              <p className="text-zinc-400">Build streaks and earn points as you master new concepts</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="container pb-20">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-violet-500" />
          Available Subjects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/practice/math">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-800 hover:border-violet-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
              <div className="relative p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                      <Calculator className="w-6 h-6 text-violet-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Mathematics</h3>
                    <p className="text-zinc-400 mb-4">Practice arithmetic, algebra, and more with interactive questions</p>
                  </div>
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    Grades 1-12
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Adaptive Difficulty
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/practice/english">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-800 hover:border-violet-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
              <div className="relative p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                      <BookOpen className="w-6 h-6 text-violet-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">English Grammar</h3>
                    <p className="text-zinc-400 mb-4">Master grammar rules with comprehensive practice questions</p>
                  </div>
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    Grades 1-12
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Progressive Learning
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container py-20 border-t border-zinc-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Join thousands of students who are already improving their skills through our interactive platform
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-violet-500" />
            </div>
            <div className="text-3xl font-bold text-white">10,000+</div>
            <div className="text-sm text-zinc-400">Active Students</div>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-violet-500" />
            </div>
            <div className="text-3xl font-bold text-white">500,000+</div>
            <div className="text-sm text-zinc-400">Questions Answered</div>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-violet-500" />
            </div>
            <div className="text-3xl font-bold text-white">1,000+</div>
            <div className="text-sm text-zinc-400">Practice Hours</div>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-violet-500" />
            </div>
            <div className="text-3xl font-bold text-white">95%</div>
            <div className="text-sm text-zinc-400">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container py-20 border-t border-zinc-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Student Success Stories</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Hear from our students who have improved their academic performance
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="relative overflow-hidden p-6 bg-zinc-900/50 border-zinc-800">
            <div className="absolute top-4 right-4">
              <Quote className="w-8 h-8 text-violet-500 opacity-50" />
            </div>
            <div className="space-y-4">
              <p className="text-zinc-300 italic">
                "The adaptive learning system helped me improve my math scores significantly. The instant feedback and explanations are incredibly helpful."
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <div className="font-semibold text-white">Sarah M.</div>
                  <div className="text-sm text-zinc-400">Grade 8 Student</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden p-6 bg-zinc-900/50 border-zinc-800">
            <div className="absolute top-4 right-4">
              <Quote className="w-8 h-8 text-violet-500 opacity-50" />
            </div>
            <div className="space-y-4">
              <p className="text-zinc-300 italic">
                "The grammar practice helped me understand complex concepts better. I love how it tracks my progress and suggests areas for improvement."
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <div className="font-semibold text-white">James R.</div>
                  <div className="text-sm text-zinc-400">Grade 10 Student</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden p-6 bg-zinc-900/50 border-zinc-800">
            <div className="absolute top-4 right-4">
              <Quote className="w-8 h-8 text-violet-500 opacity-50" />
            </div>
            <div className="space-y-4">
              <p className="text-zinc-300 italic">
                "As a parent, I'm impressed with how engaging the platform is. My daughter's confidence in both math and English has grown tremendously."
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <div className="font-semibold text-white">Lisa T.</div>
                  <div className="text-sm text-zinc-400">Parent</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Learning?</h2>
              <p className="text-lg text-violet-100 max-w-2xl">
                Begin your journey to academic excellence with our adaptive learning platform
              </p>
            </div>
            // In the Call to Action section - Math Practice Button
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="group relative overflow-hidden rounded-full px-8 py-6 bg-white/10 hover:bg-white/20 text-white border-white/20 transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  // Direct navigation without auth manipulation
                  window.location.href = '/practice/math';
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                </div>
                <span className="relative flex items-center gap-2 text-lg font-semibold">
                  Start Math Practice
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              <Link href="/practice/english">
                <Button size="lg" variant="outline" className="group relative overflow-hidden rounded-full px-8 py-6 bg-white/10 hover:bg-white/20 text-white border-white/20 transition-all duration-300">
                  <span className="relative flex items-center gap-2 text-lg font-semibold">
                    Start English Practice
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">About</h3>
              <p className="text-sm text-zinc-400">
                An interactive learning platform designed to help students master mathematics and English grammar through adaptive practice sessions.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Subjects</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <Link href="/practice/math" className="hover:text-violet-400 transition-colors">
                    Mathematics
                  </Link>
                </li>
                <li>
                  <Link href="/practice/english" className="hover:text-violet-400 transition-colors">
                    English Grammar
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Resources</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <Link href="/practice" className="hover:text-violet-400 transition-colors">
                    Practice Arena
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-violet-400 transition-colors">
                    Leaderboard
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Connect</h3>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-violet-500/20 hover:text-violet-400 transition-all duration-300"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-400">
            <p>&copy; {new Date().getFullYear()} Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}