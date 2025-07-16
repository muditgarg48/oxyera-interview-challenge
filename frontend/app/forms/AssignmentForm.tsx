// frontend/components/AssignmentForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '../constants';
import { Patient, Medication } from '../types';

export default function AssignmentForm({ onSuccess }: { onSuccess: () => void }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [patientId, setPatientId] = useState<number>(0);
  const [medicationId, setMedicationId] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');
  const [days, setDays] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, medicationsRes] = await Promise.all([
          fetch(`${API_URL}/patient`),
          fetch(`${API_URL}/medication`)
        ]);
        
        const patientsData = await patientsRes.json() as Patient[];
        const medicationsData = await medicationsRes.json() as Medication[];
        
        setPatients(patientsData);
        setMedications(medicationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/assignment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          patientId: patientId,
          medicationId: medicationId,
          startDate,
          days: days
        }),
      });
      setPatientId(0);
      setMedicationId(0);
      setStartDate('');
      setDays(0);
      onSuccess();
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Patient</label>
        <select
          value={patientId}
          onChange={(e) => setPatientId(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Medication</label>
        <select
          value={medicationId}
          onChange={(e) => setMedicationId(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select Medication</option>
          {medications.map((medication) => (
            <option key={medication.id} value={medication.id}>
              {medication.name} ({medication.dosage})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block mb-1">Duration (days)</label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
          min="1"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Assign Medication
      </button>
    </form>
  );
}