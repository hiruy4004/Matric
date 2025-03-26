"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Dashboard from './dashboard'
import QuestionForm from './components/question-form'
import ImportExport from './components/import-export'
import Statistics from './components/statistics'

export default function AdminPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam || 'dashboard')
  
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`/admin?tab=${tab}`)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex space-x-2 sm:hidden">
        <select 
          value={activeTab}
          onChange={(e) => handleTabChange(e.target.value)}
          className="w-full p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-400 focus:border-violet-500/50 focus:ring-violet-500/20"
        >
          <option value="dashboard">Dashboard</option>
          <option value="add">Add Question</option>
          <option value="import">Import/Export</option>
          <option value="stats">Statistics</option>
        </select>
      </div>
      
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'add' && <QuestionForm />}
        {activeTab === 'import' && <ImportExport />}
        {activeTab === 'stats' && <Statistics />}
      </div>
    </div>
  )
}