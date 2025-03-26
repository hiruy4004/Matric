"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function QuestionEditor() {
  const [question, setQuestion] = useState('');
  const [correct, setCorrect] = useState('');
  const [incorrect, setIncorrect] = useState(['', '', '']);
  const [difficulty, setDifficulty] = useState('medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('questions')
      .insert([{
        question,
        correct_answer: correct,
        incorrect_answers: incorrect.filter(a => a.trim()),
        difficulty,
        created_at: new Date()
      }]);

    if (!error) {
      alert('Question added!');
      setQuestion('');
      setCorrect('');
      setIncorrect(['', '', '']);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg">
      <div className="space-y-4">
        <div>
          <label>Question:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label>Correct Answer:</label>
          <input
            type="text"
            value={correct}
            onChange={(e) => setCorrect(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {incorrect.map((ans, i) => (
          <div key={i}>
            <label>Incorrect Answer {i + 1}:</label>
            <input
              type="text"
              value={ans}
              onChange={(e) => {
                const newIncorrect = [...incorrect];
                newIncorrect[i] = e.target.value;
                setIncorrect(newIncorrect);
              }}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <div>
          <label>Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Add Question
        </button>
      </div>
    </form>
  );
}