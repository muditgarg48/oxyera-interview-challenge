'use client';

import { useState } from 'react';
import { API_URL } from '../constants';

export default function MedicationForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/medication`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dosage, frequency }),
      });
      setName('');
      setDosage('');
      setFrequency('');
      onSuccess();
    } catch (error) {
      console.error('Error creating medication:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Medication Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block mb-1">Dosage</label>
        <input
          type="text"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block mb-1">Frequency</label>
        <input
          type="text"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Medication
      </button>
    </form>
  );
}