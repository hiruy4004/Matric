"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, LucideIcon } from "lucide-react"

interface Reward {
  icon: LucideIcon
  title: string
  xp: number
  claimed: boolean
}

interface RewardsProps {
  rewards: Reward[]
}

export function Rewards({ rewards }: RewardsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Gift className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Available Rewards</h2>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2">
        {rewards.map((reward) => (
          <Card 
            key={reward.title}
            className={`group flex min-w-[250px] items-center gap-3 p-4 transition-all hover:shadow-lg ${
              reward.claimed ? 'opacity-50' : ''
            }`}
          >
            <div className="rounded-lg bg-primary/10 p-2">
              <reward.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{reward.title}</p>
              <p className="text-sm text-muted-foreground">+{reward.xp} XP</p>
            </div>
            <Button 
              size="sm" 
              disabled={reward.claimed}
              className="gap-2"
            >
              {reward.claimed ? 'Claimed' : 'Claim'}
              {!reward.claimed && <Gift className="h-4 w-4" />}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
} 