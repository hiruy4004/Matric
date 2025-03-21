"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calculator, BookOpen, ChevronRight } from "lucide-react"

export default function PracticePage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="text-3xl font-bold">Choose a Subject</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Changed to /practice/math to go directly to math questions */}
          <Link href="/practice/math">
            <Card className="group relative overflow-hidden p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                    <Calculator className="w-6 h-6 text-violet-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Mathematics</h3>
                  <p className="text-muted-foreground mb-4">Practice arithmetic, algebra, and more</p>
                </div>
              </div>
              <Button className="w-full">
                Start Practice
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </Link>

          <Link href="/practice/english">
            <Card className="group relative overflow-hidden p-6 hover:shadow-lg transition-all">
              {/* Rest of the English card remains unchanged */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-violet-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">English Grammar</h3>
                  <p className="text-muted-foreground mb-4">Master grammar rules and vocabulary</p>
                </div>
              </div>
              <Button className="w-full">
                Start Practice
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
