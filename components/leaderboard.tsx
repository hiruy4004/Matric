"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp } from "lucide-react"

interface Player {
  rank: number
  name: string
  score: number
  avatar: string
}

interface LeaderboardProps {
  players: Player[]
}

export function Leaderboard({ players }: LeaderboardProps) {
  const [showAll, setShowAll] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Leaderboard</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Less' : 'Show More'}
        </Button>
      </div>
      
      <div className="grid gap-2">
        {players.slice(0, showAll ? undefined : 3).map((player) => (
          <Card 
            key={player.rank}
            className={`group transition-all hover:shadow-md ${
              player.rank === 1 ? 'bg-yellow-500/10' :
              player.rank === 2 ? 'bg-zinc-300/10' :
              player.rank === 3 ? 'bg-orange-500/10' : ''
            }`}
          >
            <CardContent className="flex items-center gap-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background font-bold">
                {player.avatar}
              </div>
              <div className="flex-1">
                <p className="font-medium">{player.name}</p>
                <p className="text-sm text-muted-foreground">{player.score} XP</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">#{player.rank}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 