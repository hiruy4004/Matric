import { MathQuestion } from "@/types/questions"

export const mathQuestions: MathQuestion[] = [
  // Easy Questions
  {
    id: 1,
    text: "What is 6 × 7?",
    options: ["35", "42", "48", "36"],
    correctAnswer: "42",
    difficulty: "easy",
    category: "multiplication",
    explanation: "6 × 7 = 42. This is a basic multiplication fact."
  },
  {
    id: 2,
    text: "What is 15 ÷ 3?",
    options: ["3", "5", "6", "4"],
    correctAnswer: "5",
    difficulty: "easy",
    category: "division",
    explanation: "15 ÷ 3 = 5 because 3 × 5 = 15"
  },
  // Medium Questions
  {
    id: 3,
    text: "Solve for x: 3x + 7 = 22",
    options: ["5", "6", "7", "8"],
    correctAnswer: "5",
    difficulty: "medium",
    category: "algebra",
    explanation: "3x + 7 = 22\n3x = 15\nx = 5"
  },
  {
    id: 4,
    text: "What is the area of a triangle with base 8 and height 6?",
    options: ["24", "48", "20", "16"],
    correctAnswer: "24",
    difficulty: "medium",
    category: "geometry",
    explanation: "Area of triangle = (base × height) ÷ 2\n(8 × 6) ÷ 2 = 24"
  },
  // Hard Questions
  {
    id: 5,
    text: "If 3x² + 6x = 27, what is the positive value of x?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "3",
    difficulty: "hard",
    category: "algebra",
    explanation: "3x² + 6x = 27\n3x(x + 2) = 27\nx(x + 2) = 9\nx² + 2x - 9 = 0\n(x + 3)(x - 1) = 0\nx = 3 (positive value)"
  },
  {
    id: 6,
    text: "What is the volume of a sphere with radius 4 units?",
    options: ["201.06", "268.08", "288.00", "301.59"],
    correctAnswer: "268.08",
    difficulty: "hard",
    category: "geometry",
    explanation: "Volume of sphere = (4/3)πr³\n(4/3) × π × 4³ = 268.08"
  }
] 