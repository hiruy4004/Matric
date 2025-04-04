"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card"

interface HintCardProps {
  hint: string
  hintsLeft: number
  onUseHint: () => void
}

export function HintCard({ hint, hintsLeft, onUseHint }: HintCardProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  const handleRevealHint = () => {
    setIsRevealed(true)
    onUseHint()
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Hints Available</span>
            </div>
            <span className="text-2xl font-bold">{hintsLeft}</span>
            // Update hint text and labels
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Concept Assistance</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Reveal a learning tip for this question
              </CardDescription>
            </CardHeader>
            <CardFooter className="px-4 pb-2">
              <span className="text-xs text-muted-foreground">
                {hintsLeft} support hints remaining • Hints refresh daily
              </span>
            </CardFooter>
          </div>
          {!isRevealed ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleRevealHint}
              disabled={hintsLeft <= 0}
            >
              Use Hint (-50 points)
            </Button>
          ) : (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">{hint}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}