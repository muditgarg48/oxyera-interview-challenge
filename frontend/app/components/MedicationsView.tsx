'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '../constants';
import { Medication, Patient, Assignment } from '../types';

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
            <div key={medication.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-semibold">{medication.name}</h2>
              <div className="text-sm text-gray-600">
                Dosage: {medication.dosage} | Frequency: {medication.frequency}
              </div>
              <div className="mt-2">
                <span className="font-medium">Assigned to:</span> {assignedPatients.length} patients
              </div>
              
              {assignedPatients.length > 0 && (
                <div className="mt-4 space-y-3">
                  {assignedPatients.map(patient => (
                    <div key={patient.id} className="border rounded p-3">
                      <div className="font-medium">{patient.name}</div>
                      {patient.assignments
                        ?.filter(a => a.medication?.id === medication.id)
                        .map(assignment => (
                          <div key={assignment.id} className="mt-2 text-sm">
                            <div>Start Date: {new Date(assignment.startDate).toLocaleDateString()}</div>
                            <div>Progress: {assignment.days - (assignment.remainingDays || 0)}/{assignment.days} days</div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return <MedicationList />;
}