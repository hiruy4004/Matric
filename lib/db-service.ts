import { PrismaClient } from '@prisma/client'
import { Difficulty } from '@/types/questions'

// Create a singleton instance of PrismaClient
const prisma = global.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') global.prisma = prisma

// Only keep one initializeDatabase function
export async function initializeDatabase() {
  try {
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // Check if we need to seed data
    const count = await prisma.question.count()
    if (count === 0) {
      console.log('Seeding initial questions...')
      // Your seeding logic here
    }
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

// Export prisma for use in other files
export { prisma }
