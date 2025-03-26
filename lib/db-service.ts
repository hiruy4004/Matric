import { PrismaClient } from '@prisma/client'
import { MathQuestion, EnglishQuestion } from '@/types/questions'
import { Difficulty } from '@/types/questions'

const prisma = new PrismaClient()

// Initialize the database with seed data if needed
export async function initializeDatabase() {
  const count = await prisma.question.count()
  
  if (count === 0) {
    console.log('Seeding database with initial questions...')
  }
}

// Get random questions for a specific subject
export async function getRandomQuestions(
  subject: string,
  count: number = 10,
  difficulty?: string,
  grade?: number
): Promise<(MathQuestion | EnglishQuestion)[]> {
  let whereClause: any = { subject }
  
  if (difficulty) {
    whereClause.difficulty = difficulty
  }
  
  if (grade) {
    whereClause.grade = grade
  }
  
  const questions = await prisma.question.findMany({
    where: whereClause,
    take: count,
    orderBy: {
      id: 'asc'
    }
  })
  
  // Shuffle the questions for true randomness
  return questions
    .sort(() => Math.random() - 0.5)
    .map((q: { 
      id: number;
      text: string;
      correctAnswer: string;
      options: string;
      difficulty: string;
      grade: number;
      hint?: string;
      category: string;
      subject: string;
    }) => {
      try {
        const parsedOptions = JSON.parse(q.options || '[]');
        const questionType = q.subject.toLowerCase() === 'math' ? 'MathQuestion' : 'EnglishQuestion';
        
        return {
          id: q.id,
          question: q.text,
          correct_answer: q.correctAnswer,
          incorrect_answers: Array.isArray(parsedOptions) 
            ? parsedOptions
                .filter((opt: string) => opt !== q.correctAnswer)
                .sort(() => Math.random() - 0.5)
            : [],
          difficulty: (q.difficulty || 'medium').toLowerCase() as Difficulty,
          grade: q.grade,
          hint: q.hint || "Think carefully about this question",
          category: q.category || 'general',
          subject: q.subject,
          type: questionType
        };
      } catch (error) {
        console.error('Error parsing question options:', error);
        return null;
      }
    })
    .filter((q): q is (MathQuestion | EnglishQuestion) => q !== null);
}

// Add a new question to the database
export async function addQuestion(questionData: any, subject: string) {
  try {
    const question = {
      text: questionData.question,
      correctAnswer: questionData.correct_answer,
      options: JSON.stringify([questionData.correct_answer, ...questionData.incorrect_answers]),
      difficulty: questionData.difficulty,
      grade: questionData.grade,
      hint: questionData.hint,
      category: questionData.category || 'general',
      subject: subject
    }

    return await prisma.question.create({
      data: question
    })
  } catch (error) {
    console.error('Error adding question:', error)
    throw error
  }
}

// Get questions by subject and difficulty
export async function getQuestionsByDifficulty(
  subject: string,
  difficulty: string,
  count: number = 10
) {
  return getRandomQuestions(subject, count, difficulty)
}

// Get questions by grade level
export async function getQuestionsByGrade(
  subject: string,
  grade: number,
  count: number = 10
) {
  return getRandomQuestions(subject, count, undefined, grade)
}

// NEW FEATURES

// Get a question by ID
export async function getQuestionById(id: number) {
  try {
    const question = await prisma.question.findUnique({
      where: { id }
    });
    
    if (!question) return null;
    
    return {
      id: question.id,
      text: question.text,
      correctAnswer: question.correctAnswer,
      options: question.options,
      difficulty: question.difficulty,
      grade: question.grade,
      hint: question.hint,
      category: question.category,
      subject: question.subject
    };
  } catch (error) {
    console.error(`Error fetching question with ID ${id}:`, error);
    return null;
  }
}

// Update an existing question
export async function updateQuestion(id: number, questionData: any) {
  const question = await prisma.question.findUnique({
    where: { id }
  })
  
  if (!question) {
    throw new Error(`Question with ID ${id} not found`)
  }
  
  return prisma.question.update({
    where: { id },
    data: {
      text: questionData.question || questionData.text,
      correctAnswer: questionData.correct_answer || questionData.correctAnswer,
      options: JSON.stringify(
        [...(questionData.incorrect_answers || []), questionData.correct_answer || questionData.correctAnswer]
      ),
      difficulty: questionData.difficulty,
      grade: questionData.grade,
      hint: questionData.hint,
      category: questionData.category || 'general',
      subject: questionData.subject || question.subject
    }
  })
}

// Delete a question
export async function deleteQuestion(id: number) {
  return prisma.question.delete({
    where: { id }
  })
}

// Bulk import questions from JSON file
// Move file operations to separate server-side functions
export async function importQuestionsFromFile(questions: any[]) {
  try {
    const results = []
    
    for (const q of questions) {
      const result = await addQuestion(q, q.subject)
      results.push(result)
    }
    
    return {
      success: true,
      count: results.length,
      message: `Successfully imported ${results.length} questions`
    }
  } catch (error) {
    console.error('Error importing questions:', error)
    return {
      success: false,
      count: 0,
      message: `Error importing questions: ${error}`
    }
  }
}

export async function exportQuestionsToFile(subject?: string) {
  const whereClause = subject ? { subject } : {}
  
  const questions = await prisma.question.findMany({
    where: whereClause
  })
  
  const formattedQuestions = questions.map(q => ({
    id: q.id,
    text: q.text,
    correctAnswer: q.correctAnswer,
    options: q.options,
    difficulty: q.difficulty,
    grade: q.grade,
    hint: q.hint,
    category: q.category,
    subject: q.subject
  }))
  
  return formattedQuestions
}

// Get question usage statistics
// Add these functions if they don't exist
export async function getQuestionStats() {
  try {
    const totalCount = await prisma.question.count();
    
    const subjectCounts = await prisma.question.groupBy({
      by: ['subject'],
      _count: {
        id: true
      }
    });
    
    const difficultyCounts = await prisma.question.groupBy({
      by: ['difficulty'],
      _count: {
        id: true
      }
    });
    
    const gradeCounts = await prisma.question.groupBy({
      by: ['grade'],
      _count: {
        id: true
      }
    });
    
    return {
      totalCount,
      subjectCounts: subjectCounts.map((item: { subject: string; _count: { id: number } }) => ({
        subject: item.subject,
        count: item._count.id
      })),
      difficultyCounts: difficultyCounts.map((item: { difficulty: string; _count: { id: number } }) => ({
        difficulty: item.difficulty,
        count: item._count.id
      })),
      gradeCounts: gradeCounts.map((item: { grade: number; _count: { id: number } }) => ({
        grade: item.grade,
        count: item._count.id
      }))
    };
  } catch (error) {
    console.error("Error getting question stats:", error);
    return {
      totalCount: 0,
      subjectCounts: [],
      difficultyCounts: [],
      gradeCounts: []
    };
  }
}
