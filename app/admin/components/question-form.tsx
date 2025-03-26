"use client"

import { useState, FormEvent } from 'react'
import { addQuestion } from '@/lib/db-service'

export default function QuestionForm() {
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    text: '',
    correctAnswer: '',
    options: '',
    difficulty: 'medium',
    grade: 5,
    hint: '',
    category: 'general',
    subject: 'math'
  })

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
      const questionData = {
        question: formData.text,
        correct_answer: formData.correctAnswer, // Match backend expectation
        incorrect_answers: formData.options.split(',').map(opt => opt.trim())
                           .filter(opt => opt !== formData.correctAnswer),
        difficulty: formData.difficulty,
        grade: formData.grade,
        hint: formData.hint,
        category: formData.category,
        subject: formData.subject
      }
      
      await addQuestion(questionData, formData.subject)
      setMessage('Question added successfully!')
      
      // Reset form
      setFormData({
        text: '',
        correctAnswer: '',
        options: '',
        difficulty: 'medium',
        grade: 5,
        hint: '',
        category: 'general',
        subject: 'math'
      })
    } catch (error) {
      console.error('Error adding question:', error)
      setMessage('Error adding question. Please try again.')
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">Add New Question</h1>
      
      {message && (
        <div className="bg-violet-500/10 border border-violet-500/50 text-violet-200 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-zinc-400 mb-1">Subject</label>
              <select 
                name="subject" 
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-zinc-800/30 border border-zinc-700 text-white focus:border-violet-500/50 focus:ring-violet-500/20"
              >
                <option value="math">Math</option>
                <option value="english">English</option>
              </select>
            </div>
            
            <div>
              <label className="block text-zinc-400 mb-1">Question Text</label>
              <textarea 
                name="text" 
                value={formData.text}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-zinc-800/30 border border-zinc-700 text-white focus:border-violet-500/50 focus:ring-violet-500/20"
                rows={3}
                required
              />
            </div>
            
            <div>
              <label className="block text-zinc-400 mb-1">Correct Answer</label>
              <input 
                type="text" 
                name="correctAnswer" 
                value={formData.correctAnswer}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-zinc-800/30 border border-zinc-700 text-white focus:border-violet-500/50 focus:ring-violet-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-zinc-400 mb-1">Options (comma-separated)</label>
              <textarea 
                name="options" 
                value={formData.options}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-zinc-800/30 border border-zinc-700 text-white focus:border-violet-500/50 focus:ring-violet-500/20"
                rows={3}
                placeholder="option1, option2, option3"
                required
              />
            </div>
            
            <div>
              <label className="block text-zinc-400 mb-1">Difficulty</label>
              <select 
                name="difficulty" 
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-zinc-800/30 border border-zinc-700 text-white focus:border-violet-500/50 focus:ring-violet-500/20"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label className="block text-zinc-400 mb-1">Grade Level (1-12)</label>
              <input 
                type="number" 
                name="grade" 
                value={formData.grade}
                onChange={handleChange}
                min="1"
                max="12"
                className="w-full p-2 rounded-lg bg-zinc-800/30 border border-zinc-700 text-white focus:border-violet-500/50 focus:ring-violet-500/20"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Hint</label>
          <textarea 
            name="hint" 
            value={formData.hint}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-zinc-800/30 border border-zinc-700 text-white focus:border-violet-500/50 focus:ring-violet-500/20"
            rows={2}
          />
        </div>
        
        <div>
          <label className="block text-zinc-400 mb-1">Category</label>
          <input 
            type="text" 
            name="category" 
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-zinc-800/30 border border-zinc-700 text-white focus:border-violet-500/50 focus:ring-violet-500/20"
          />
        </div>
        
        <div className="flex justify-end">
          <button 
            type="submit"
            className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-medium transition-colors"
          >
            Add Question
          </button>
        </div>
      </form>
    </div>
  )
}