'use client';

import { useState } from 'react';
import { API_URL } from '../constants';

export default function PatientForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/patient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dateOfBirth }),
      });
      setName('');
      setDateOfBirth('');
      onSuccess();
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block mb-1">Date of Birth</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Patient
      </button>
    </form>
  );
}