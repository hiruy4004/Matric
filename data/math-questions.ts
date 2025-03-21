import { MathQuestion } from "@/types/questions"

export const mathQuestions: MathQuestion[] = [
  // Ensure all questions have the correct structure and types
  {
    id: 1,
    text: "What is 6 × 7?",
    options: ["35", "42", "48", "36"],
    explanation: "6 × 7 equals 42 because when you multiply 6 groups of 7, you get 42",
    correctAnswer: "42",
    difficulty: "easy",
    category: "multiplication",
    grade: 3
  },
  {
    id: 2,
    text: "Solve for x: 2x + 5 = 15",
    explanation: "To solve for x, subtract 5 from both sides: 2x = 10, then divide both sides by 2: x = 5",
    options: ["5", "10", "7.5", "6"],
    correctAnswer: "5",
    difficulty: "medium",
    category: "algebra",
    grade: 7
  },
  // Continue adding more questions...
];