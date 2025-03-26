"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getQuestionStats } from '@/lib/db-service'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const statsData = await getQuestionStats()
      setStats(statsData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/questions" className="group p-6 bg-zinc-800/30 border border-zinc-700 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300">
          <h2 className="text-xl font-semibold text-white mb-2">Manage Questions</h2>
          <p className="text-zinc-400">View, edit, and delete questions in the database</p>
        </Link>
        
        <Link href="/admin?tab=add" className="group p-6 bg-zinc-800/30 border border-zinc-700 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300">
          <h2 className="text-xl font-semibold text-white mb-2">Add Question</h2>
          <p className="text-zinc-400">Create new questions for quizzes</p>
        </Link>
        
        <Link href="/admin?tab=import" className="group p-6 bg-zinc-800/30 border border-zinc-700 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300">
          <h2 className="text-xl font-semibold text-white mb-2">Import/Export</h2>
          <p className="text-zinc-400">Bulk import or export questions</p>
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center p-8 text-zinc-400">
          <p>Loading statistics...</p>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-zinc-800/30 border border-zinc-700 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Question Overview</h2>
            <div className="text-4xl font-bold text-violet-500 mb-4">{stats.totalCount}</div>
            <p className="text-zinc-400">Total questions in database</p>
            
            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-white">By Subject</h3>
              {stats.subjectCounts.map((item: any) => (
                <div key={item.subject} className="flex justify-between text-zinc-400">
                  <span className="capitalize">{item.subject}</span>
                  <span className="font-semibold text-violet-400">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 bg-zinc-800/30 border border-zinc-700 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Difficulty Distribution</h2>
            <div className="space-y-3">
              {stats.difficultyCounts.map((item: any) => (
                <div key={item.difficulty} className="flex justify-between text-zinc-400">
                  <span className="capitalize">{item.difficulty}</span>
                  <span className="font-semibold text-violet-400">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}