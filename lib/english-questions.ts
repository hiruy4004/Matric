import { Difficulty } from "@/types/questions"
import { englishQuestions } from "@/data/english-questions"
import { getRandomQuestions } from '@/lib/db-service'

interface EnglishQuestion {
  question: string
  correct_answer: string
  incorrect_answers: string[]
  difficulty: Difficulty
  grade: number
  hint: string
}

interface GrammarTemplate {
  question: string
  answers: Record<string, string[]>
  hint: string
}

interface SubjectTemplate extends GrammarTemplate {
  getAnswer: (subject: string) => string
}

type PluralAnswers = {
  [key: string]: string[]
}

interface WordTemplate extends GrammarTemplate {
  answers: PluralAnswers
  validWords: string[]
}

interface SentenceTemplate extends GrammarTemplate {
  answers: Record<string, string[]>
}

interface SubjectQuestion {
  template: (subject: string) => SubjectTemplate
  subjects: string[]
}

interface WordQuestion {
  template: (word: string) => WordTemplate
  words: string[]
  validWords: string[]
}

// Add specific type for answer options
type AnswerOptions = string[]

interface SentenceChoice {
  text: string
  options: AnswerOptions
}

interface SentenceQuestion {
  template: (sentence: string, options: string[]) => SentenceTemplate
  sentences: SentenceChoice[]
}

// Improve type guards with more specific checks
function isSubjectQuestion(question: any): question is SubjectQuestion {
  return "subjects" in question && 
         Array.isArray(question.subjects) && 
         "template" in question &&
         typeof question.template === "function"
}

function isWordQuestion(question: any): question is WordQuestion {
  return "words" in question && 
         Array.isArray(question.words) &&
         "template" in question &&
         typeof question.template === "function" &&
         "validWords" in question &&
         Array.isArray(question.validWords)
}

function isSentenceQuestion(question: any): question is SentenceQuestion {
  return "sentences" in question && 
         Array.isArray(question.sentences) &&
         "template" in question &&
         typeof question.template === "function"
}

// Add validation function for questions
function validateQuestion(question: EnglishQuestion): boolean {
  return (
    typeof question.question === "string" &&
    question.question.length > 0 &&
    typeof question.correct_answer === "string" &&
    question.correct_answer.length > 0 &&
    Array.isArray(question.incorrect_answers) &&
    question.incorrect_answers.length > 0 &&
    !question.incorrect_answers.includes(question.correct_answer) &&
    typeof question.hint === "string" &&
    question.hint.length > 0 &&
    typeof question.grade === "number" &&
    question.grade >= 1 &&
    question.grade <= 12
  )
}

const grammarQuestions = {
  // Grades 1-2
  elementary1: [
    {
      template: (subject: string) => ({
        question: `Choose the correct verb: ${subject} _____ to school.`,
        answers: {
          goes: ["go", "going", "gone"],
          go: ["goes", "going", "gone"]
        },
        getAnswer: (subject: string) => 
          ["I", "you", "we", "they"].includes(subject.toLowerCase()) ? "go" : "goes",
        hint: "Remember: He/She/It uses 'goes', while I/You/We/They use 'go'"
      }),
      subjects: ["He", "She", "They", "We", "The boy", "The girls"]
    },
    {
      template: (word: string) => ({
        question: `What is the plural form of "${word}"?`,
        answers: {
          "cats": ["cat's", "cates", "cat"],
          "boxes": ["boxs", "box's", "box"],
          "puppies": ["puppys", "puppy's", "puppy"],
          "dishes": ["dishs", "dish's", "dish"],
          "children": ["childs", "child's", "childrens"],
          "feet": ["foots", "foot's", "feets"]
        },
        validWords: ["cat", "box", "puppy", "dish", "child", "foot"],
        hint: "Remember special plural rules: -s, -es, -ies, and irregular forms"
      })
    },
    {
      template: (sentence: string, options: string[]) => ({
        question: `Choose the correct article: ${sentence}`,
        answers: {
          [options[0]]: options.slice(1)
        },
        hint: "Use 'a' before consonant sounds, 'an' before vowel sounds"
      }),
      sentences: [
        {
          text: "I saw _____ elephant at the zoo.",
          options: ["an", "a", "the", ""]
        },
        {
          text: "She has _____ umbrella.",
          options: ["an", "a", "the", ""]
        }
      ]
    }
  ],
  // Grades 3-4
  elementary2: [
    {
      template: (sentence: string, options: string[]) => ({
        question: `Choose the correct past tense: ${sentence}`,
        answers: {
          [options[0]]: options.slice(1)
        },
        hint: "Think about what happened in the past - regular or irregular verb?"
      }),
      sentences: [
        {
          text: "Yesterday, I _____ my homework.",
          options: ["did", "done", "doing", "does"]
        },
        {
          text: "Last week, she _____ to the park.",
          options: ["went", "gone", "going", "goes"]
        },
        {
          text: "They _____ the whole pizza.",
          options: ["ate", "eaten", "eating", "eats"]
        }
      ]
    },
    {
      template: (sentence: string, options: string[]) => ({
        question: `Choose the correct pronoun: _____ ${sentence}`,
        answers: {
          [options[0]]: options.slice(1)
        },
        hint: "Think about the pronoun's role in the sentence (subject, object, possessive)"
      }),
      sentences: [
        {
          text: "gave me the book.",
          options: ["He", "Him", "His", "Himself"]
        },
        {
          text: "and I went to the store.",
          options: ["She", "Her", "Hers", "Herself"]
        },
        {
          text: "The book belongs to _____.",
          options: ["them", "they", "their", "themselves"]
        }
      ]
    }
  ],
  // Grades 5-6
  intermediate1: [
    {
      template: (sentence: string, options: string[]) => ({
        question: `Choose the correct verb tense: ${sentence}`,
        answers: {
          [options[0]]: options.slice(1)
        },
        hint: "Consider the timeline - when did/does/will the action happen?"
      }),
      sentences: [
        {
          text: "By next week, I _____ the project.",
          options: ["will have finished", "will finish", "finished", "have finished"]
        },
        {
          text: "She _____ for three hours when I called.",
          options: ["had been studying", "was studying", "studied", "has studied"]
        },
        {
          text: "They _____ in Paris for five years now.",
          options: ["have lived", "lived", "are living", "were living"]
        }
      ]
    },
    {
      template: (sentence: string, options: string[]) => ({
        question: `Choose the correct comparative/superlative form: ${sentence}`,
        answers: {
          [options[0]]: options.slice(1)
        },
        hint: "For comparisons: short words add -er/-est, long words use more/most"
      }),
      sentences: [
        {
          text: "This book is _____ than that one.",
          options: ["more interesting", "interestinger", "most interesting", "much interesting"]
        },
        {
          text: "Mount Everest is the _____ mountain in the world.",
          options: ["highest", "more high", "most high", "higher"]
        }
      ]
    }
  ],
  // Grades 7-8
  intermediate2: [
    {
      template: (sentence: string, options: string[]) => ({
        question: `Choose the correct sentence structure: ${sentence}`,
        answers: {
          [options[0]]: options.slice(1)
        },
        hint: "Consider subject-verb agreement and proper clause structure"
      }),
      sentences: [
        {
          text: "Neither of the students _____ the answer.",
          options: ["knows", "know", "have known", "are knowing"]
        },
        {
          text: "The team, along with their coach, _____ arriving tomorrow.",
          options: ["is", "are", "were", "have been"]
        },
        {
          text: "Each of the boxes _____ a label.",
          options: ["needs", "need", "are needing", "have needed"]
        }
      ]
    },
    {
      template: (sentence: string, options: string[]) => ({
        question: `Choose the correct modifier placement: ${sentence}`,
        answers: {
          [options[0]]: options.slice(1)
        },
        hint: "Place modifiers close to what they modify to avoid confusion"
      }),
      sentences: [
        {
          text: "_____ running through the park, I saw a rare bird.",
          options: ["While", "During", "After", "Before"]
        }
      ]
    }
  ],
  // Grades 9-10
  advanced1: [
    {
      template: (sentence: string, options: string[]) => ({
        question: `Choose the correct clause connector: ${sentence}`,
        answers: {
          [options[0]]: options.slice(1)
        },
        hint: "Consider the logical relationship between clauses"
      }),
      sentences: [
        {
          text: "_____ I studied hard, I passed the test.",
          options: ["Because", "Despite", "However", "Otherwise"]
        },
        {
          text: "The project, _____ was completed last week, won an award.",
          options: ["which", "that", "what", "whose"]
        },
        {
          text: "_____ the rain, the game continued.",
          options: ["Despite", "Because", "Unless", "Whether"]
        }
      ]
    }
  ],
  // Grades 11-12
  advanced2: [
    {
      template: (sentence: string, options: string[]) => ({
        question: `Choose the correct subjunctive mood: ${sentence}`,
        answers: {
          [options[0]]: options.slice(1)
        },
        hint: "Use subjunctive for wishes, suggestions, and hypothetical situations"
      }),
      sentences: [
        {
          text: "I wish I _____ there to help.",
          options: ["were", "was", "am", "be"]
        },
        {
          text: "The teacher suggested that he _____ the assignment.",
          options: ["submit", "submits", "submitted", "had submitted"]
        },
        {
          text: "If I _____ a million dollars, I would travel the world.",
          options: ["had", "have", "would have", "will have"]
        }
      ]
    },
    {
      template: (sentence: string, options: string[]) => ({
        question: `Choose the correct parallel structure: ${sentence}`,
        answers: {
          [options[0]]: options.slice(1)
        },
        hint: "Keep similar ideas in similar grammatical forms"
      }),
      sentences: [
        {
          text: "The candidate's goals were _____",
          options: [
            "to increase sales, to reduce costs, and to improve quality",
            "increasing sales, reducing costs, and quality improvement",
            "to increase sales, reducing costs, and quality improvement",
            "increasing sales, to reduce costs, and improving quality"
          ]
        },
        {
          text: "The job requires _____ .",
          options: [
            "attention to detail, ability to multitask, and excellent communication",
            "being detail-oriented, multitasking, and to communicate well",
            "attention to detail, multitasking abilities, and communicates well",
            "being detailed, able to multitask, and good communication"
          ]
        }
      ]
    }
  ]
}

function getGradeLevel(grade: number): keyof typeof grammarQuestions {
  if (grade <= 2) return "elementary1"
  if (grade <= 4) return "elementary2"
  if (grade <= 6) return "intermediate1"
  if (grade <= 8) return "intermediate2"
  if (grade <= 10) return "advanced1"
  return "advanced2"
}

function generateGrammarQuestion(grade: number): EnglishQuestion {
  if (grade < 1 || grade > 12) {
    throw new Error("Grade must be between 1 and 12")
  }

  const level = getGradeLevel(grade)
  const questions = grammarQuestions[level]
  
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error(`No questions available for grade level: ${level}`)
  }

  const questionType = questions[Math.floor(Math.random() * questions.length)]
  let question: EnglishQuestion

  if (isSubjectQuestion(questionType)) {
    const subject = questionType.subjects[Math.floor(Math.random() * questionType.subjects.length)]
    const template = questionType.template(subject)
    const correctAnswer = template.getAnswer(subject)
    
    question = {
      question: template.question,
      correct_answer: correctAnswer,
      incorrect_answers: template.answers[correctAnswer] || [],
      difficulty: grade <= 4 ? "easy" : grade <= 8 ? "medium" : "hard",
      grade,
      hint: template.hint
    }
  } else if (isWordQuestion(questionType)) {
    const word = questionType.words[Math.floor(Math.random() * questionType.words.length)]
    const template = questionType.template(word) as WordTemplate
    const pluralForm = Object.keys(template.answers).find(key => 
      template.answers[key].includes(word) || key === word
    ) || word
    
    question = {
      question: template.question,
      correct_answer: pluralForm,
      incorrect_answers: template.answers[pluralForm] || [],
      difficulty: grade <= 4 ? "easy" : grade <= 8 ? "medium" : "hard",
      grade,
      hint: template.hint
    }
  } else if (isSentenceQuestion(questionType)) {
    const sentence = questionType.sentences[Math.floor(Math.random() * questionType.sentences.length)]
    const template = questionType.template(sentence.text, sentence.options)
    
    question = {
      question: template.question,
      correct_answer: sentence.options[0],
      incorrect_answers: sentence.options.slice(1),
      difficulty: grade <= 4 ? "easy" : grade <= 8 ? "medium" : "hard",
      grade,
      hint: template.hint
    }
  } else {
    throw new Error("Invalid question type")
  }

  // Validate the generated question
  if (!validateQuestion(question)) {
    throw new Error("Generated question failed validation")
  }

  return question
}

export async function generateEnglishQuestions(count: number = 10): Promise<EnglishQuestion[]> {
  count = Math.max(count, 10);

  try {
    const dbQuestions = await getRandomQuestions('english', count);
    
    if (dbQuestions && dbQuestions.length >= count) {
      return dbQuestions
        .filter((q): q is EnglishQuestion => {
          try {
            return !!q && (
              typeof q.question === 'string' && q.question.length > 0 &&
              typeof q.correct_answer === 'string' && q.correct_answer.length > 0 &&
              Array.isArray(q.incorrect_answers) &&
              q.incorrect_answers.every(ans => typeof ans === 'string') &&
              q.incorrect_answers.length > 0 &&
              !q.incorrect_answers.includes(q.correct_answer) &&
              typeof q.hint === 'string' && q.hint.length > 0 &&
              Number.isInteger(q.grade) && q.grade >= 1 && q.grade <= 12 &&
              typeof q.difficulty === 'string' &&
              ['easy', 'medium', 'hard'].includes(q.difficulty.toLowerCase())
            );
          } catch {
            return false;
          }
        })
        .slice(0, count);
    }
    
    const additionalCount = count - (dbQuestions?.length || 0);
    const questions: EnglishQuestion[] = (dbQuestions || [])
      .filter((q): q is EnglishQuestion => {
        try {
          return !!q && (
            typeof q.question === 'string' && q.question.length > 0 &&
            typeof q.correct_answer === 'string' && q.correct_answer.length > 0 &&
            Array.isArray(q.incorrect_answers) &&
            q.incorrect_answers.every(ans => typeof ans === 'string') &&
            q.incorrect_answers.length > 0 &&
            !q.incorrect_answers.includes(q.correct_answer) &&
            typeof q.hint === 'string' && q.hint.length > 0 &&
            Number.isInteger(q.grade) && q.grade >= 1 && q.grade <= 12 &&
            typeof q.difficulty === 'string' &&
            ['easy', 'medium', 'hard'].includes(q.difficulty.toLowerCase())
          );
        } catch {
          return false;
        }
      });
    const maxAttempts = additionalCount * 2;
    let attempts = 0;

    while (questions.length < count && attempts < maxAttempts) {
      attempts++;
      const grade = Math.floor(Math.random() * 12) + 1;
      
      try {
        const question = generateGrammarQuestion(grade);
        if (!questions.some(q => q.question === question.question)) {
          questions.push(question);
        }
      } catch (error) {
        console.error(`Failed to generate question: ${error}`);
      }
    }

    // Add fallback question if needed
    if (questions.length < count) {
      questions.push({
        question: "Choose the correct verb: He _____ to school.",
        correct_answer: "goes",
        incorrect_answers: ["go", "going", "gone"],
        difficulty: "easy",
        grade: 1,
        hint: "Use 'goes' with he/she/it"
      });
    }

    return questions;
  } catch (error) {
    console.error("Error fetching questions from database:", error);
    
    // Fallback to the original method
    if (englishQuestions && Array.isArray(englishQuestions) && englishQuestions.length > 0) {
      // Create properly typed arrays
      const easy: EnglishQuestion[] = [];
      const medium: EnglishQuestion[] = [];
      const hard: EnglishQuestion[] = [];
      
      // Sort questions into difficulty buckets with proper typing
      englishQuestions.forEach(q => {
        try {
          const question: EnglishQuestion = {
            question: typeof q.text === 'string' ? q.text : "Question unavailable",
            correct_answer: typeof q.correctAnswer === 'string' ? q.correctAnswer : "",
            incorrect_answers: Array.isArray(q.options) && typeof q.correctAnswer === 'string' ? 
                              q.options.filter(o => o !== q.correctAnswer) : [],
            difficulty: (q.difficulty as Difficulty) || "medium",
            grade: typeof q.grade === 'number' ? q.grade : typeof q.difficulty === 'string' && q.difficulty === 'hard' ? 10 : q.difficulty === 'medium' ? 6 : 3,
            hint: typeof q.explanation === 'string' ? q.explanation : "Think carefully"
          };
          
          if (question.question && question.correct_answer && question.incorrect_answers.length > 0) {
            if (question.difficulty === 'easy') easy.push(question);
            else if (question.difficulty === 'medium') medium.push(question);
            else hard.push(question);
          }
        } catch (error) {
          console.error("Error processing question:", error);
        }
      });
  
      // Create the initial array of questions
      let result = shuffleArray([
        ...selectRandom(easy, Math.ceil(count * 0.4)),
        ...selectRandom(medium, Math.ceil(count * 0.4)),
        ...selectRandom(hard, Math.ceil(count * 0.2))
      ]);
  
      // If we don't have enough questions, generate more using the grammar generator
      if (result.length < count) {
        const additionalCount = count - result.length;
        const additionalQuestions: EnglishQuestion[] = [];
        const maxAttempts = additionalCount * 2;
        let attempts = 0;
  
        while (additionalQuestions.length < additionalCount && attempts < maxAttempts) {
          attempts++;
          const grade = Math.floor(Math.random() * 12) + 1;
          
          try {
            const question = generateGrammarQuestion(grade);
            if (!result.some(q => q.question === question.question) && 
                !additionalQuestions.some(q => q.question === question.question)) {
              additionalQuestions.push(question);
            }
          } catch (error) {
            console.error(`Failed to generate additional question: ${error}`);
          }
        }
  
        result = [...result, ...additionalQuestions];
      }
  
      return result.slice(0, count);
    } else {
      // Fallback to generating grammar questions
      if (count < 1) {
        throw new Error("Count must be greater than 0")
      }
  
      const questions: EnglishQuestion[] = []
      const maxAttempts = count * 2
      let attempts = 0
  
      while (questions.length < count && attempts < maxAttempts) {
        attempts++
        const grade = Math.floor(Math.random() * 12) + 1
        
        try {
          const question = generateGrammarQuestion(grade)
          if (!questions.some(q => q.question === question.question)) {
            questions.push(question)
          }
        } catch (error) {
          console.error(`Failed to generate question: ${error}`)
          if (attempts >= maxAttempts && questions.length < count) {
            questions.push({
              question: "Choose the correct verb: He _____ to school.",
              correct_answer: "goes",
              incorrect_answers: ["go", "going", "gone"],
              difficulty: "easy",
              grade: 1,
              hint: "Use 'goes' with he/she/it"
            })
          }
        }
      }
      return questions
    }
  } // Properly closes catch block
} // Properly closes generateEnglishQuestions function

function selectRandom(arr: EnglishQuestion[], count: number) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

function shuffleArray(array: EnglishQuestion[]) {
  return array.sort(() => Math.random() - 0.5);
}
