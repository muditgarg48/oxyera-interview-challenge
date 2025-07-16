'use client';

import { useEffect, useState } from 'react';
import { API_URL } from './constants';
import { Patient, Assignment } from './types';
import PopupForm from './components/PopupForm';
import PatientCard from './components/PatientCard';

export default function Home() {
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API_URL}/patient`);
      const data = await res.json();
      // Fetch remaining days for each assignment
      const patientsWithRemainingDays = await Promise.all(
        data.map(async (patient: Patient) => {
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
      setPatients(patientsWithRemainingDays);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setLoading(true);
    fetchPatients();
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Patient Management</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setShowPatientForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Patient
        </button>
        <button
          onClick={() => setShowMedicationForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Medication
        </button>
        <button
          onClick={() => setShowAssignmentForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Assign Medication
        </button>
      </div>
      
      <div className="grid gap-6">
        {patients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>

      <PopupForm
        showForm={showPatientForm}
        groupName="PATIENT"
        onClose={() => setShowPatientForm(false)}
        onSuccess={() => {
          refreshData();
          setShowPatientForm(false);
        }}
      />
      <PopupForm
        showForm={showMedicationForm}
        groupName="MEDICATION"
        onClose={() => setShowMedicationForm(false)}
        onSuccess={() => {
          refreshData();
          setShowMedicationForm(false);
        }}
      />
      <PopupForm
        showForm={showAssignmentForm}
        groupName="ASSIGNMENT"
        onClose={() => setShowAssignmentForm(false)}
        onSuccess={() => {
          refreshData();
          setShowAssignmentForm(false);
        }}
      />

    </div>
  );
}