import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900">
      <nav className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="font-bold text-xl text-violet-500">
                  ES Admin
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin"
                  className="border-transparent text-zinc-400 hover:text-violet-500 hover:border-violet-500/50 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/questions"
                  className="border-transparent text-zinc-400 hover:text-violet-500 hover:border-violet-500/50 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Questions
                </Link>
                <Link
                  href="/admin?tab=add"
                  className="border-transparent text-zinc-400 hover:text-violet-500 hover:border-violet-500/50 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Add Question
                </Link>
                <Link
                  href="/admin?tab=import"
                  className="border-transparent text-zinc-400 hover:text-violet-500 hover:border-violet-500/50 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Import/Export
                </Link>
                <Link
                  href="/admin?tab=stats"
                  className="border-transparent text-zinc-400 hover:text-violet-500 hover:border-violet-500/50 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Statistics
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/"
                className="text-zinc-400 hover:text-violet-500 px-3 py-2 rounded-full border border-zinc-700 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300 text-sm font-medium"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="py-6">
        {children}
      </main>
    </div>
  )
}