"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Upload, Download, AlertCircle } from "lucide-react"

export default function ImportExport() {
  const [message, setMessage] = useState('')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!importFile) {
      setMessage('Please select a file to import')
      return
    }
    
    try {
      setIsLoading(true)
      setMessage('Processing import...')
      
      // Read the file content
      const fileContent = await importFile.text();
      let questions;
      
      try {
        questions = JSON.parse(fileContent);
      } catch (error) {
        setMessage('Invalid JSON file. Please check the file format.');
        setIsLoading(false);
        return;
      }
      
      if (!Array.isArray(questions)) {
        setMessage('Invalid format. File must contain an array of questions.');
        setIsLoading(false);
        return;
      }
      
      // Import the questions
      const result = await bulkImportQuestions(questions);
      setMessage(`Successfully imported ${result.length} questions`);
      setImportFile(null);
    } catch (error) {
      console.error('Error importing questions:', error);
      setMessage('Error importing questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (subject?: string) => {
    try {
      setIsLoading(true);
      setMessage('Preparing export...');
      
      const questions = await exportQuestions(subject);
      
      // Create a blob with the JSON data
      const blob = new Blob([JSON.stringify(questions, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = subject ? `${subject}-questions.json` : 'all-questions.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      const subjectText = subject ? subject : 'all';
      setMessage(`Successfully exported ${questions.length} ${subjectText} questions`);
    } catch (error) {
      console.error('Error exporting questions:', error);
      setMessage('Error exporting questions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">Import/Export Questions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Import Section */}
        <div className="p-6 bg-zinc-800/30 border border-zinc-700 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4">Import Questions</h3>
          <form onSubmit={handleImport} className="space-y-4">
            <div>
              <label className="block text-zinc-400 mb-2">
                Select JSON file to import
              </label>
              <input
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0])}
                className="block w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-violet-600 file:text-white hover:file:bg-violet-500 file:transition-colors"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !importFile}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-full transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isLoading ? 'Importing...' : 'Import Questions'}
            </Button>
          </form>
        </div>

        {/* Export Section */}
        <div className="p-6 bg-zinc-800/30 border border-zinc-700 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4">Export Questions</h3>
          <form onSubmit={handleExport} className="space-y-4">
            <div>
              <label className="block text-zinc-400 mb-2">
                Select subject (optional)
              </label>
              <select
                value={exportSubject}
                onChange={(e) => setExportSubject(e.target.value)}
                className="w-full p-2 rounded-lg bg-zinc-800/30 border border-zinc-700 text-white focus:border-violet-500/50 focus:ring-violet-500/20"
              >
                <option value="">All Subjects</option>
                <option value="math">Mathematics</option>
                <option value="english">English</option>
              </select>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-full transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              {isLoading ? 'Exporting...' : 'Export Questions'}
            </Button>
          </form>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/50 text-violet-200 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>{message}</p>
        </div>
      )}
    </div>
  )
}