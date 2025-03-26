"use client"

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getQuestionById, updateQuestion } from '@/lib/db-service'

export default function EditQuestionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    text: '',
    correctAnswer: '',
    options: '',
    difficulty: '',
    grade: 1,
    hint: '',
    category: '',
    subject: ''
  })

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true)
        const id = parseInt(params.id)
        const question = await getQuestionById(id)
        
        if (!question) {
          setError('Question not found')
          return
        }
        
        // Parse options from JSON string
        const options = JSON.parse(question.options)
        
        setFormData({
          text: question.text,
          correctAnswer: question.correctAnswer,
          options: options.filter((opt: string) => opt !== question.correctAnswer).join(', '),
          difficulty: question.difficulty,
          grade: question.grade,
          hint: question.hint || '',
          category: question.category,
          subject: question.subject
        })
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching question:', error)
        setError('Failed to load question')
        setLoading(false)
      }
    }
    
    fetchQuestion()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grade' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    try {
      // Parse options from comma-separated string
      const optionsArray = formData.options.split(',').map(opt => opt.trim())
      
      // Make sure correctAnswer is in the options
      if (!optionsArray.includes(formData.correctAnswer)) {
        optionsArray.push(formData.correctAnswer)
      }
      
      const questionData = {
        question: formData.text,
        correct_answer: formData.correctAnswer,
        incorrect_answers: optionsArray.filter(opt => opt !== formData.correctAnswer),
        difficulty: formData.difficulty,
        grade: formData.grade,
        hint: formData.hint,
        category: formData.category,
        subject: formData.subject
      }
      
      const id = parseInt(params.id)
      await updateQuestion(id, questionData)
      
      setMessage('Question updated successfully!')
      
      // Redirect back to questions list after a short delay
      setTimeout(() => {
        router.push('/admin/questions')
      }, 1500)
    } catch (error) {
      console.error('Error updating question:', error)
      setError('Failed to update question')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Question</h1>
        <div className="text-center p-8">
          <p>Loading question...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Question</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link href="/admin/questions" className="text-blue-500 hover:underline">
          ← Back to Questions
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Question #{params.id}</h1>
      
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Subject</label>
          <select 
            name="subject" 
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="math">Math</option>
            <option value="english">English</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1">Question Text</label>
          <input 
            type="text" 
            name="text" 
            value={formData.text}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Correct Answer</label>
          <input 
            type="text" 
            name="correctAnswer" 
            value={formData.correctAnswer}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Options (comma-separated)</label>
          <input 
            type="text" 
            name="options" 
            value={formData.options}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="option1, option2, option3"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Difficulty</label>
          <select 
            name="difficulty" 
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1">Grade Level (1-12)</label>
          <input 
            type="number" 
            name="grade" 
            value={formData.grade}
            onChange={handleChange}
            min="1"
            max="12"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Hint</label>
          <textarea 
            name="hint" 
            value={formData.hint}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>
        
        <div>
          <label className="block mb-1">Category</label>
          <input 
            type="text" 
            name="category" 
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="flex space-x-2">
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Question
          </button>
          
          <Link 
            href="/admin/questions"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 inline-block"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}