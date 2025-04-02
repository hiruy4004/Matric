import { Difficulty } from "@/types/questions"
import { cn } from "@/lib/utils"

export function DifficultyBadge({ difficulty }: { difficulty: string | null | undefined }) {
  // Add a default value if difficulty is null or undefined
  const difficultyValue = difficulty || 'unknown';
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500":
            difficultyValue === "easy",
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500":
            difficultyValue === "medium",
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500":
            difficultyValue === "hard",
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300":
            difficultyValue !== "easy" && difficultyValue !== "medium" && difficultyValue !== "hard",
        }
      )}
    >
      {difficultyValue.charAt(0).toUpperCase() + difficultyValue.slice(1)}
    </span>
  )
}