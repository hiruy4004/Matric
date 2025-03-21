"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BrainCircuit, CheckCircle2, Flame, Target, Timer } from "lucide-react"

interface DailyGoalsProps {
  goals: {
    questionsTarget: number
    questionsCompleted: number
    timeTarget: number
    timeSpent: number
    streakTarget: number
    currentStreak: number
  }
}

export function DailyGoals({ goals }: DailyGoalsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Daily Goals</h2>
        </div>
        <p className="text-sm text-muted-foreground">Resets in 8h 45m</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-blue-500" />
                <p className="font-medium">Questions</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {goals.questionsCompleted}/{goals.questionsTarget}
              </p>
            </div>
            <Progress 
              value={(goals.questionsCompleted / goals.questionsTarget) * 100}
              className="h-2"
            />
            {goals.questionsCompleted >= goals.questionsTarget && (
              <div className="mt-2 flex items-center gap-1 text-sm text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <span>Completed!</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-green-500" />
                <p className="font-medium">Study Time</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {goals.timeSpent}/{goals.timeTarget}min
              </p>
            </div>
            <Progress 
              value={(goals.timeSpent / goals.timeTarget) * 100}
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <p className="font-medium">Streak</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {goals.currentStreak}/{goals.streakTarget}
              </p>
            </div>
            <Progress 
              value={(goals.currentStreak / goals.streakTarget) * 100}
              className="h-2"
            />
            <div className="mt-4">
              <h3 className="text-lg font-medium">Learning Progress</h3>
              <p className="text-sm text-muted-foreground">
                Today's mastery milestones
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}