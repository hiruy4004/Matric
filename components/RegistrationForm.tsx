"use client";
import { useState } from 'react';
import { addRegistration } from '@/lib/firebase-config';

export default function RegistrationForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addRegistration(name, email, team);
    if (result) {
      alert('Registration successful!');
      // Reset form
      setName('');
      setEmail('');
      setTeam('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700">Name:</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Team Name:</label>
        <input
          type="text"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Register
      </button>
    </form>
  );
}