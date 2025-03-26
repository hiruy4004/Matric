"use client";
import { useEffect, useState } from 'react';
import { getRegistrations } from '@/lib/firebase-config';

export default function RegistrationsList() {
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRegistrations();
      setRegistrations(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Registrations ({registrations.length})</h2>
      <div className="space-y-2">
        {registrations.map(reg => (
          <div key={reg.id} className="p-2 border-b">
            <p><strong>{reg.name}</strong> ({reg.email})</p>
            <p>Team: {reg.team}</p>
            <p className="text-sm text-gray-500">{new Date(reg.timestamp?.seconds * 1000).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}