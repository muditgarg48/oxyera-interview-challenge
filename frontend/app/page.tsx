"use client"

import { useEffect, useState } from 'react';
import { API_URL } from './constants';
import { SampleEntity, Patient, Medication, Assignment } from './types';

export default function Home() {
  const [samples, setSamples] = useState<SampleEntity[]>([]);
  const [name, setName] = useState('');

  const fetchSamples = async () => {
    const res = await fetch(`${API_URL}/sample`);
    const data = await res.json();
    setSamples(data);
  };

  const createSample = async () => {
    if (!name.trim()) return;
    await fetch(`${API_URL}/sample`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setName('');
    fetchSamples();
  };

  useEffect(() => {
    fetchSamples();
  }, []);

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Sample Entity Manager</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border px-2 py-1 rounded w-64"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={createSample} className="bg-blue-600 text-white px-4 py-1 rounded">
          Add
        </button>
      </div>

      <ul className="space-y-1">
        {samples.map((s) => (
          <li key={s.id} className="border-b pb-1">
            #{s.id} - {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
