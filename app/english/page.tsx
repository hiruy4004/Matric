"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function EnglishPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white dark:from-black dark:to-zinc-900">
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/practice" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Practice
              </Link>
            </Button>
          </div>
          
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">English Grammar Practice</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Improve your English grammar skills with interactive practice questions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flex flex-col items-center text-center p-6">
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-xl mb-2">Grammar Practice</CardTitle>
              <p className="text-muted-foreground mb-6">
                Test your knowledge of English grammar rules and concepts.
              </p>
              <Button className="mt-auto w-full" asChild>
                <Link href="/practice/english/grammar">Start Grammar Practice</Link>
              </Button>
            </Card>
            
            <Card className="flex flex-col items-center text-center p-6">
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-xl mb-2">Vocabulary Practice</CardTitle>
              <p className="text-muted-foreground mb-6">
                Expand your vocabulary and improve your word usage.
              </p>
              <Button className="mt-auto w-full" asChild>
                <Link href="/practice/english/vocabulary">Start Vocabulary Practice</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}