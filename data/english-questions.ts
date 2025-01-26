import { EnglishQuestion } from "@/types/questions"

export const englishQuestions: EnglishQuestion[] = [
  // Easy Questions
  {
    id: 1,
    text: "Choose the correct word: The weather _____ nice today.",
    options: ["is", "are", "am", "be"],
    correctAnswer: "is",
    difficulty: "easy",
    category: "grammar",
    explanation: "'Weather' is a singular noun, so we use 'is' as the verb."
  },
  {
    id: 2,
    text: "Which word means the opposite of 'happy'?",
    options: ["sad", "glad", "joyful", "pleased"],
    correctAnswer: "sad",
    difficulty: "easy",
    category: "vocabulary",
    explanation: "The antonym (opposite) of 'happy' is 'sad'."
  },
  // Medium Questions
  {
    id: 3,
    text: "Choose the correct form: If I _____ rich, I would travel the world.",
    options: ["am", "were", "was", "be"],
    correctAnswer: "were",
    difficulty: "medium",
    category: "grammar",
    explanation: "In conditional sentences expressing unreality, we use 'were' for all persons."
  },
  {
    id: 4,
    text: "Which word is spelled correctly?",
    options: ["accomodate", "accommodate", "acommodate", "acomodate"],
    correctAnswer: "accommodate",
    difficulty: "medium",
    category: "spelling",
    explanation: "'Accommodate' has two 'c's and two 'm's."
  },
  // Hard Questions
  {
    id: 5,
    text: "Choose the correct sentence:",
    options: [
      "Neither of the options were correct.",
      "Neither of the options was correct.",
      "Neither of the options are correct.",
      "Neither of the options have been correct."
    ],
    correctAnswer: "Neither of the options was correct.",
    difficulty: "hard",
    category: "grammar",
    explanation: "'Neither' is singular, so it takes a singular verb 'was'."
  },
  {
    id: 6,
    text: "What does 'ephemeral' mean?",
    options: [
      "lasting forever",
      "lasting a very short time",
      "extremely important",
      "extremely large"
    ],
    correctAnswer: "lasting a very short time",
    difficulty: "hard",
    category: "vocabulary",
    explanation: "'Ephemeral' means lasting for a very short time, transient, or temporary."
  }
] 