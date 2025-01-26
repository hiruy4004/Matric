"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { 
  Atom,
  Award,
  BookOpen, 
  BrainCircuit, 
  ChevronRight, 
  Clock,
  Crown,
  Flame,
  GraduationCap, 
  History,
  Languages, 
  LineChart, 
  Medal, 
  Star,
  Target,
  Trophy,
  Globe,
  Dna,
  Sparkles,
  Zap,
  Users,
  CheckCircle2,
  Timer,
  TrendingUp,
  Gift
} from "lucide-react"
import { DailyGoals } from "@/components/daily-goals"
import { Rewards } from "@/components/rewards"
import { Leaderboard } from "@/components/leaderboard"

export default function PracticePage() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  // Mock statistics - in a real app, these would come from your backend
  const stats = {
    mathProgress: 65,
    englishProgress: 45,
    scienceProgress: 30,
    historyProgress: 55,
    totalQuestions: 150,
    streak: 7,
    rank: 23,
    totalUsers: 100,
    timeSpent: "12h 30m",
    lastActive: "2 hours ago",
    level: 12,
    xp: 2450,
    nextLevelXp: 3000,
    dailyGoals: {
      questionsTarget: 20,
      questionsCompleted: 15,
      timeTarget: 60, // minutes
      timeSpent: 45,
      streakTarget: 7,
      currentStreak: 5
    },
    rewards: [
      { icon: Star, title: "5 Day Streak", xp: 100, claimed: false },
      { icon: Trophy, title: "Complete 10 Math Problems", xp: 50, claimed: true },
      { icon: Medal, title: "Score 90%+ in English", xp: 150, claimed: false }
    ],
    achievements: [
      { icon: Flame, title: "7 Day Streak", color: "orange" },
      { icon: Target, title: "100% in Math", color: "blue" },
      { icon: Crown, title: "Top 10%", color: "yellow" },
      { icon: Zap, title: "Speed Demon", color: "purple" }
    ],
    leaderboard: [
      { rank: 1, name: "Alex S.", score: 2850, avatar: "👑" },
      { rank: 2, name: "Maria R.", score: 2720, avatar: "🥈" },
      { rank: 3, name: "John D.", score: 2680, avatar: "🥉" },
      { rank: 4, name: "Sarah M.", score: 2550, avatar: "🌟" },
      { rank: 5, name: "David K.", score: 2490, avatar: "⭐" }
    ]
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const subjects = [
    {
      title: "Mathematics",
      description: "Algebra, Geometry, and more",
      icon: GraduationCap,
      color: "blue",
      progress: stats.mathProgress,
      score: "92/100",
      href: "/practice/math",
      topics: ["Algebra", "Geometry", "Calculus"],
      achievements: ["Perfect Score", "Fast Learner", "Problem Solver"],
      recentTopics: ["Quadratic Equations", "Trigonometry"]
    },
    {
      title: "English",
      description: "Grammar and vocabulary",
      icon: Languages,
      color: "green",
      progress: stats.englishProgress,
      score: "88/100",
      href: "/practice/english",
      topics: ["Grammar", "Vocabulary", "Writing"],
      achievements: ["Grammar Master", "Vocabulary Expert"],
      recentTopics: ["Past Perfect", "Active Voice"]
    },
    {
      title: "Science",
      description: "Physics, Chemistry, Biology",
      icon: Atom,
      color: "purple",
      progress: stats.scienceProgress,
      score: "78/100",
      href: "/practice/science",
      topics: ["Physics", "Chemistry", "Biology"],
      achievements: ["Lab Master", "Scientific Mind"],
      recentTopics: ["Newton's Laws", "Chemical Bonds"]
    },
    {
      title: "History",
      description: "World History and Geography",
      icon: Globe,
      color: "orange",
      progress: stats.historyProgress,
      score: "85/100",
      href: "/practice/history",
      topics: ["World History", "Geography", "Civics"],
      achievements: ["Time Traveler", "Geography Pro"],
      recentTopics: ["World War II", "Ancient Egypt"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 pb-8 pt-6">
      <div className="container max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-4xl font-bold text-transparent">
                Welcome back, {user?.name || "Student"}! 👋
              </h1>
              <p className="text-muted-foreground">
                Continue your learning journey and improve your skills
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <p className="text-lg font-bold">Level {stats.level}</p>
              </div>
              <div className="mt-2 w-32">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">XP</span>
                  <span className="font-medium">{stats.xp}/{stats.nextLevelXp}</span>
                </div>
                <Progress 
                  value={(stats.xp / stats.nextLevelXp) * 100} 
                  className="h-1.5 bg-primary/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Goals */}
        <div className="mb-8 animate-fade-in opacity-0" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
          <DailyGoals goals={stats.dailyGoals} />
        </div>

        {/* Rewards */}
        <div className="mb-8 animate-fade-in opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
          <Rewards rewards={stats.rewards} />
        </div>

        {/* Achievements */}
        <div className="mb-8 animate-fade-in opacity-0" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Recent Achievements</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {stats.achievements.map((achievement, index) => (
              <Card 
                key={achievement.title}
                className="group flex min-w-[200px] items-center gap-3 p-4 transition-all hover:shadow-lg"
              >
                <div className={`rounded-lg bg-${achievement.color}-500/10 p-2`}>
                  <achievement.icon className={`h-5 w-5 text-${achievement.color}-500`} />
                </div>
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">Earned today</p>
                </div>
                <Sparkles className={`ml-auto h-4 w-4 text-${achievement.color}-500 opacity-0 transition-opacity group-hover:opacity-100`} />
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {[
            {
              icon: Trophy,
              title: "Current Streak",
              value: `${stats.streak} days`,
              color: "text-yellow-500",
              detail: "Personal Best: 15 days"
            },
            {
              icon: Medal,
              title: "Your Rank",
              value: `#${stats.rank}/${stats.totalUsers}`,
              color: "text-blue-500",
              detail: "Top 10%"
            },
            {
              icon: BrainCircuit,
              title: "Questions Solved",
              value: stats.totalQuestions,
              color: "text-purple-500",
              detail: "+23 today"
            },
            {
              icon: Clock,
              title: "Time Spent",
              value: stats.timeSpent,
              color: "text-green-500",
              detail: "2.5h today"
            }
          ].map((stat, index) => (
            <Card 
              key={stat.title}
              className="group relative overflow-hidden bg-gradient-to-br from-background to-muted transition-all hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg bg-background/80 p-2 shadow-sm transition-transform group-hover:scale-110 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="mb-8 animate-fade-in opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
          <Leaderboard players={stats.leaderboard} />
        </div>

        {/* Subject Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {subjects.map((subject, index) => (
            <Card 
              key={subject.title}
              className={`group relative overflow-hidden transition-all hover:shadow-lg ${
                selectedSubject === subject.title ? 'ring-2 ring-primary' : ''
              }`}
              style={{
                animationDelay: `${0.6 + index * 0.2}s`,
                animationFillMode: "forwards",
                opacity: 0
              }}
              onClick={() => setSelectedSubject(subject.title)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-${subject.color}-500/10 to-${subject.color}-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-lg bg-${subject.color}-500/10 p-2`}>
                      <subject.icon className={`h-6 w-6 text-${subject.color}-500`} />
                    </div>
                    <div>
                      <CardTitle>{subject.title}</CardTitle>
                      <CardDescription>{subject.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium">Recent Topics</p>
                      <p className="text-xs text-muted-foreground">{subject.recentTopics.join(", ")}</p>
                    </div>
                    <Star className={`h-5 w-5 text-${subject.color}-500`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{subject.progress}%</span>
                  </div>
                  <Progress 
                    value={subject.progress} 
                    className={`h-2 bg-${subject.color}-100`}
                    indicatorClassName={`bg-${subject.color}-500`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Latest Score</p>
                    <p className="text-2xl font-bold">{subject.score}</p>
                    <div className="flex gap-1">
                      {subject.achievements.map((achievement, i) => (
                        <div 
                          key={achievement}
                          className={`text-xs text-${subject.color}-500 bg-${subject.color}-500/10 px-2 py-0.5 rounded-full`}
                        >
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link href={subject.href}>
                    <Button 
                      className="gap-2 transition-all hover:translate-x-1 hover:shadow-lg"
                      size="lg"
                    >
                      Practice Now
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }

        @keyframes slide-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  )
} 