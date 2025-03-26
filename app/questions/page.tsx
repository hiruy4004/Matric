"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { EnglishQuestion } from '@/types/questions'; // Add type import

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<EnglishQuestion[]>([]); // Add type annotation

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setQuestions(data || []);
    };

    fetchQuestions();
    const subscription = supabase
      .channel('questions')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchQuestions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">QuestionForge Database</h1>
      <div className="grid gap-6">
        {questions.map((q) => (
          <div key={q.id} className="p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="font-semibold mb-2">{q.question}</h3>
            <div className="space-y-2">
              <p>✅ {q.correct_answer}</p>
              {q.incorrect_answers.map((ans: string, i: number) => (
                <p key={i} className="text-red-600">❌ {ans}</p>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Difficulty: {q.difficulty} | Created: {new Date(q.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}