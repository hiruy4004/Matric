"use client"

import { useState, useEffect } from 'react'
import { getQuestionStats } from '@/lib/db-service'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader2 } from 'lucide-react'

export default function Statistics() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const data = await getQuestionStats()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        <span>Loading statistics...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">Question Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-zinc-800/30 border border-zinc-700 rounded-xl">
          <h3 className="text-lg font-medium text-zinc-400 mb-2">Total Questions</h3>
          <p className="text-4xl font-bold text-violet-500">{stats?.totalCount || 0}</p>
        </div>

        <div className="p-6 bg-zinc-800/30 border border-zinc-700 rounded-xl">
          <h3 className="text-lg font-medium text-zinc-400 mb-2">Subjects</h3>
          <p className="text-4xl font-bold text-violet-500">{stats?.subjectCounts?.length || 0}</p>
        </div>

        <div className="p-6 bg-zinc-800/30 border border-zinc-700 rounded-xl">
          <h3 className="text-lg font-medium text-zinc-400 mb-2">Grade Levels</h3>
          <p className="text-4xl font-bold text-violet-500">{stats?.gradeCounts?.length || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-zinc-800/30 border border-zinc-700 rounded-xl">
          <h3 className="text-lg font-medium text-white mb-4">Questions by Subject</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.subjectCounts || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="subject" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#F3F4F6'
                  }}
                  cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                />
                <Legend
                  wrapperStyle={{ color: '#9CA3AF' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                  animationBegin={200}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-zinc-800/30 border border-zinc-700 rounded-xl">
          <h3 className="text-lg font-medium text-white mb-4">Questions by Difficulty</h3>
          <div className="space-y-4">
            {stats?.difficultyCounts?.map((item: any) => (
              <div key={item.difficulty} className="flex items-center">
                <span className="text-zinc-400 w-24 capitalize">{item.difficulty}</span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-500 rounded-full"
                      style={{ 
                        width: `${(item.count / stats.totalCount) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                <span className="text-zinc-400 w-16 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}