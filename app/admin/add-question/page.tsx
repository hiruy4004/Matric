"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Plus, Trash, Database } from "lucide-react"
import Link from "next/link"

export default function AddQuestionPage() {
  const [question, setQuestion] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [incorrectAnswers, setIncorrectAnswers] = useState(['', '', ''])
  const [difficulty, setDifficulty] = useState('medium')
  const [grade, setGrade] = useState('5')
  const [hint, setHint] = useState('')
  const [subject, setSubject] = useState('english')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleIncorrectAnswerChange = (index: number, value: string) => {
    const newIncorrectAnswers = [...incorrectAnswers]
    newIncorrectAnswers[index] = value
    setIncorrectAnswers(newIncorrectAnswers)
  }

  const addIncorrectAnswer = () => {
    if (incorrectAnswers.length < 5) {
      setIncorrectAnswers([...incorrectAnswers, ''])
    }
  }

  const removeIncorrectAnswer = (index: number) => {
    if (incorrectAnswers.length > 1) {
      const newIncorrectAnswers = [...incorrectAnswers]
      newIncorrectAnswers.splice(index, 1)
      setIncorrectAnswers(newIncorrectAnswers)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!question.trim()) {
      toast.error("Question is required")
      return
    }
    
    if (!correctAnswer.trim()) {
      toast.error("Correct answer is required")
      return
    }
    
    const filteredIncorrectAnswers = incorrectAnswers.filter(a => a.trim())
    if (filteredIncorrectAnswers.length < 1) {
      toast.error("At least one incorrect answer is required")
      return
    }
    
    if (!hint.trim()) {
      toast.error("Hint is required")
      return
    }
  
    setIsSubmitting(true)
    
    try {
      // Create arrays directly instead of stringifying them
      const allOptions = [correctAnswer, ...filteredIncorrectAnswers]
      
      // Log what we're about to insert
      const questionData = {
        text: question,
        question: question,
        correctAnswer: correctAnswer,
        correct_answer: correctAnswer,
        options: allOptions, // This is correct - passing array directly
        incorrect_answers: filteredIncorrectAnswers, // This is correct - passing array directly
        difficulty,
        grade: parseInt(grade),
        hint,
        subject: subject,
        created_at: new Date().toISOString()
      }
      
      console.log("Inserting question data:", questionData)
      
      const { data, error } = await supabase
        .from('questions')
        .insert([questionData])
        .select()
      
      console.log("Supabase response:", { data, error })
      
      if (error) {
        throw error
      }
      
      toast.success("Question added successfully!")
      
      // Reset form
      setQuestion('')
      setCorrectAnswer('')
      setIncorrectAnswers(['', '', ''])
      setHint('')
    } catch (error) {
      console.error("Error adding question:", error)
      toast.error(`Failed to add question: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add this function to check database connection
  const checkDatabaseAccess = async () => {
    try {
      toast.info("Checking database connection...")
      
      // First, check if the questions table exists
      const { data: tableData, error: tableError } = await supabase
        .from('questions')
        .select('*')
        .limit(1)
      
      if (tableError) {
        console.error("Database access error:", tableError)
        toast.error(`Database access error: ${tableError.message}`)
        return
      }
      
      // Log table structure
      console.log("Table exists. Sample data:", tableData)
      
      if (tableData && tableData.length > 0) {
        const columns = Object.keys(tableData[0])
        console.log("Available columns:", columns)
        toast.success(`Table exists with columns: ${columns.join(', ')}`)
        
        // Now check quiz questions specifically
        await checkQuizQuestions()
      } else {
        console.log("Table exists but is empty")
        toast.success("Table exists but is empty. You have read permission.")
        
        // Test insert permission with a minimal record
        const testData = {
          question: "Test question (will be deleted)",
          correct_answer: "Test answer",
          incorrect_answers: JSON.stringify(["Wrong 1"]),
          difficulty: "easy",
          grade: 5,
          hint: "Test hint"
        }
        
        const { data: insertData, error: insertError } = await supabase
          .from('questions')
          .insert([testData])
          .select()
        
        if (insertError) {
          console.error("Insert permission error:", insertError)
          toast.error(`Insert permission error: ${insertError.message}`)
        } else {
          toast.success("Write permission confirmed!")
          
          // Clean up test data
          if (insertData && insertData.length > 0) {
            const { error: deleteError } = await supabase
              .from('questions')
              .delete()
              .eq('id', insertData[0].id)
            
            if (deleteError) {
              console.error("Cleanup error:", deleteError)
            } else {
              console.log("Test data cleaned up")
            }
          }
        }
      }
    } catch (error) {
      console.error("Database check failed:", error)
      toast.error(`Database check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white dark:from-black dark:to-zinc-900 py-8">
      <div className="container max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="bg-white/5 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
              <Link href="/admin" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </Link>
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 text-transparent bg-clip-text">
              Add Question
            </h1>
          </div>
          
          {/* Add database check button */}
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={checkDatabaseAccess}
            className="bg-white/5 flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Check Database
          </Button>
        </div>
        
        <Card className="backdrop-blur-sm bg-white/5 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-xl">
          <CardHeader>
            <CardTitle>Create New Question</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="bg-white/5">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="math">Math</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Question</label>
                <Textarea 
                  value={question} 
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter your question here"
                  className="min-h-[100px] bg-white/5"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Correct Answer</label>
                <Input 
                  value={correctAnswer} 
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  placeholder="Enter the correct answer"
                  className="bg-white/5"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Incorrect Answers</label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addIncorrectAnswer}
                    disabled={incorrectAnswers.length >= 5}
                    className="h-8 bg-white/5"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>
                <div className="space-y-2">
                  {incorrectAnswers.map((answer, index) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        value={answer} 
                        onChange={(e) => handleIncorrectAnswerChange(index, e.target.value)}
                        placeholder={`Incorrect answer ${index + 1}`}
                        className="bg-white/5"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => removeIncorrectAnswer(index)}
                        disabled={incorrectAnswers.length <= 1}
                        className="h-10 w-10 bg-white/5"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="bg-white/5">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Grade Level</label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger className="bg-white/5">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                        <SelectItem key={g} value={g.toString()}>
                          Grade {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Hint</label>
                <Textarea 
                  value={hint} 
                  onChange={(e) => setHint(e.target.value)}
                  placeholder="Enter a helpful hint for this question"
                  className="min-h-[80px] bg-white/5"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding Question...' : 'Add Question'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


// Modify your checkDatabaseAccess function to include the quiz questions check
const checkDatabaseAccess = async () => {
  try {
    toast.info("Checking database connection...")
    
    // First, check if the questions table exists
    const { data: tableData, error: tableError } = await supabase
      .from('questions')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.error("Database access error:", tableError)
      toast.error(`Database access error: ${tableError.message}`)
      return
    }
    
    // Log table structure
    console.log("Table exists. Sample data:", tableData)
    
    if (tableData && tableData.length > 0) {
      const columns = Object.keys(tableData[0])
      console.log("Available columns:", columns)
      toast.success(`Table exists with columns: ${columns.join(', ')}`)
      
      // Now check quiz questions specifically
      await checkQuizQuestions()
    } else {
      console.log("Table exists but is empty")
      toast.success("Table exists but is empty. You have read permission.")
      
      // Test insert permission with a minimal record
      const testData = {
        question: "Test question (will be deleted)",
        correct_answer: "Test answer",
        incorrect_answers: ["Wrong 1"],
        options: ["Test answer", "Wrong 1"],
        difficulty: "easy",
        grade: 5,
        hint: "Test hint",
        subject: "english"
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('questions')
        .insert([testData])
        .select()
      
      if (insertError) {
        console.error("Insert permission error:", insertError)
        toast.error(`Insert permission error: ${insertError.message}`)
      } else {
        toast.success("Write permission confirmed!")
        
        // Clean up test data
        if (insertData && insertData.length > 0) {
          const { error: deleteError } = await supabase
            .from('questions')
            .delete()
            .eq('id', insertData[0].id)
          
          if (deleteError) {
            console.error("Cleanup error:", deleteError)
          } else {
            console.log("Test data cleaned up")
          }
        }
      }
    }
  } catch (error) {
    console.error("Database check failed:", error)
    toast.error(`Database check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Add this function to check quiz questions specifically
const checkQuizQuestions = async () => {
  try {
    toast.info("Checking quiz questions...")
    
    // Check questions by subject
    const { data: englishQuestions, error: englishError } = await supabase
      .from('questions')
      .select('*')
      .eq('subject', 'english')
      .limit(5)
    
    if (englishError) {
      console.error("Error fetching English questions:", englishError)
      toast.error(`Error fetching English questions: ${englishError.message}`)
      return
    }
    
    console.log("English questions:", englishQuestions)
    toast.success(`Found ${englishQuestions.length} English questions`)
    
    // Check if the questions have the required fields for the quiz
    if (englishQuestions.length > 0) {
      const firstQuestion = englishQuestions[0]
      const requiredFields = ['question', 'correct_answer', 'incorrect_answers', 'options', 'difficulty', 'grade', 'hint']
      const missingFields = requiredFields.filter(field => !firstQuestion[field])
      
      if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields)
        toast.error(`Question is missing required fields: ${missingFields.join(', ')}`)
      } else {
        toast.success("Questions have all required fields")
        
        // Check the format of the fields
        if (typeof firstQuestion.incorrect_answers === 'string') {
          toast.warning("incorrect_answers is stored as a string, not a JSON array. This might cause issues.")
        }
        
        if (typeof firstQuestion.options === 'string') {
          toast.warning("options is stored as a string, not a JSON array. This might cause issues.")
        }
      }
    }
    
    // Also check how the quiz system is fetching questions
    console.log("Checking how the quiz system fetches questions...")
    
    // This is a common issue - check if the system is using a different field name
    const { data: textQuestions, error: textError } = await supabase
      .from('questions')
      .select('*')
      .eq('subject', 'english')
      .not('text', 'is', null)
      .limit(5)
    
    if (textError) {
      console.error("Error checking text field:", textError)
    } else {
      console.log("Questions with text field:", textQuestions)
      toast.info(`Found ${textQuestions.length} questions with text field`)
    }
  } catch (error) {
    console.error("Quiz question check failed:", error)
    toast.error(`Quiz question check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}