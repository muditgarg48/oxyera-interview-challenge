'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '../constants';
import { Medication, Patient, Assignment } from '../types';
import MedicationCard from './MedicationCard';

export default function MedicationsView({ onMedicationAdded, onAssignmentAdded }: {
  onMedicationAdded?: () => void, 
  onAssignmentAdded?: () => void
}) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const [medicationsRes, patientsRes] = await Promise.all([
        fetch(`${API_URL}/medication`),
        fetch(`${API_URL}/patient`)
      ]);
      
      const medicationsData = await medicationsRes.json();
      const patientsData = await patientsRes.json();
      
      const patientsWithRemainingDays = await Promise.all(
        patientsData.map(async (patient: Patient) => {
          const assignmentsWithDays = await Promise.all(
            patient.assignments?.map(async (assignment: Assignment) => {
              const daysRes = await fetch(
                `${API_URL}/assignment/${assignment.id}/remaining-days`
              );
              const { remainingDays } = await daysRes.json();
              return { ...assignment, remainingDays };
            }) || []
          );
          return { ...patient, assignments: assignmentsWithDays };
        })
      );

      setMedications(medicationsData);
      setFilteredMedications(medicationsData);
      setPatients(patientsWithRemainingDays);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setLoading(true);
    fetchAllData();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (onMedicationAdded || onAssignmentAdded) {
      refreshData();
    }
  }, [onMedicationAdded, onAssignmentAdded]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMedications(medications);
    } else {
      const filtered = medications.filter(medication =>
        medication.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMedications(filtered);
    }
  }, [searchTerm, medications]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search medications by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute left-3 top-3 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <div className="grid gap-6">
        {filteredMedications.length > 0 ? (
          filteredMedications.map((medication) => {
            const assignedPatients = patients.filter(patient => 
              patient.assignments?.some(a => a.medication?.id === medication.id)
            );
            
            return (
              <MedicationCard
                key={medication.id}
                medication={medication}
                assignedPatients={assignedPatients}
              />
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No medications match your search' : 'No medications found'}
          </div>
        )}
      </div>
    </div>
  );
}