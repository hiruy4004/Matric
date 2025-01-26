import { Difficulty } from "@/types/questions"
import { cn } from "@/lib/utils"

interface DifficultyBadgeProps {
  difficulty: Difficulty
  className?: string
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400":
            difficulty === "easy",
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400":
            difficulty === "medium",
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400":
            difficulty === "hard",
        },
        className
      )}
    >
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  )
} 