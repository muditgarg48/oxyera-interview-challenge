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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const [medicationsRes, patientsRes] = await Promise.all([
        fetch(`${API_URL}/medication`),
        fetch(`${API_URL}/patient`)
      ]);
      
      const medicationsData = await medicationsRes.json();
      const patientsData = await patientsRes.json();
      
      // Enhance patients with remaining days data
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

  if (loading) return <div>Loading...</div>;

  const MedicationList = () => {
    return (
      <div className="grid gap-6">
        {medications.map((medication) => {
          const assignedPatients = patients.filter(patient => 
            patient.assignments?.some(a => a.medication?.id === medication.id)
          );
          
          return (
            <MedicationCard
              medication={medication}
              assignedPatients={assignedPatients}
            />
          );
        })}
      </div>
    );
  }

  return <MedicationList />;
}