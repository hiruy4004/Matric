"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getRandomQuestions, deleteQuestion } from '@/lib/db-service'

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState({
    subject: '',
    difficulty: '',
    grade: ''
  })

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      // In a real implementation, you would use a more specific API
      // that supports filtering and pagination
      const allQuestions = await getRandomQuestions('', 100) // Get up to 100 questions
      
      // Apply filters if any are set
      let filtered = [...allQuestions]
      
      if (filter.subject) {
        filtered = filtered.filter(q => q.subject === filter.subject)
      }
      
      if (filter.difficulty) {
        filtered = filtered.filter(q => q.difficulty === filter.difficulty)
      }
      
      if (filter.grade) {
        filtered = filtered.filter(q => q.grade === parseInt(filter.grade))
      }
      
      setQuestions(filtered)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching questions:', error)
      setError('Failed to load questions')
      setLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilter(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleApplyFilters = () => {
    fetchQuestions()
  }

  const handleResetFilters = () => {
    setFilter({
      subject: '',
      difficulty: '',
      grade: ''
    })
    fetchQuestions()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(id)
        // Refresh the questions list
        fetchQuestions()
      } catch (error) {
        console.error('Error deleting question:', error)
        setError('Failed to delete question')
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Questions</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Filter Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Subject</label>
            <select
              name="subject"
              value={filter.subject}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Subjects</option>
              <option value="math">Math</option>
              <option value="english">English</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Difficulty</label>
            <select
              name="difficulty"
              value={filter.difficulty}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Grade</label>
            <select
              name="grade"
              value={filter.grade}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Grades</option>
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>Grade {i+1}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleApplyFilters}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Apply Filters
          </button>
          
          <button
            onClick={handleResetFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center p-8">
          <p>Loading questions...</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <Link href="/admin" className="text-blue-500 hover:underline">
              ← Back to Admin Dashboard
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Question</th>
                  <th className="py-2 px-4 border">Subject</th>
                  <th className="py-2 px-4 border">Difficulty</th>
                  <th className="py-2 px-4 border">Grade</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.length > 0 ? (
                  questions.map(question => (
                    <tr key={question.id}>
                      <td className="py-2 px-4 border">{question.id}</td>
                      <td className="py-2 px-4 border">
                        <div className="max-w-md truncate">{question.question}</div>
                      </td>
                      <td className="py-2 px-4 border capitalize">{question.subject}</td>
                      <td className="py-2 px-4 border capitalize">{question.difficulty}</td>
                      <td className="py-2 px-4 border">{question.grade}</td>
                      <td className="py-2 px-4 border">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/admin/edit/${question.id}`}
                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(question.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 px-4 text-center">
                      No questions found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}