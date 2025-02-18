"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Flame, Star } from "lucide-react"
import React from 'react';

interface ScoreboardProps {
  score: number;
  streak: number;
  correctAnswers: number;
  wrongAnswers: number;
  grade: string;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  score,
  streak,
  correctAnswers,
  wrongAnswers,
  grade,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Score</span>
            </div>
            <span className="text-2xl font-bold">{score}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Streak</span>
            </div>
            <span className="text-2xl font-bold">{streak}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Grade Level</span>
            </div>
            <span className="text-2xl font-bold">{grade}</span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600 dark:text-green-400">Correct</span>
              <span className="font-medium">{correctAnswers}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-red-600 dark:text-red-400">Wrong</span>
              <span className="font-medium">{wrongAnswers}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}