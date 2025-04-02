import { prisma } from '@/lib/db-service'
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { exportQuestionsToFile } from '@/lib/db-service'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const questions = data.questions

    if (!questions) {
      return NextResponse.json({ error: 'No questions provided' }, { status: 400 })
    }

    const exportDir = join(process.cwd(), 'exports')
    await mkdir(exportDir, { recursive: true })

    const fileName = `questions_${Date.now()}.json`
    const filePath = join(exportDir, fileName)
    
    await writeFile(filePath, JSON.stringify(questions, null, 2))

    return NextResponse.json({ 
      success: true,
      filePath,
      message: `Successfully exported ${questions.length} questions` 
    })
  } catch (error) {
    console.error('Error handling file operation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      where: { subject: 'math' },
      take: 10
    })
    return NextResponse.json(questions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}