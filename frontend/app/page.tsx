'use client';

import { useEffect, useState } from 'react';
import { API_URL } from './constants';
import { Patient, Assignment } from './types';
import PatientForm from './forms/PatientForm';
import MedicationForm from './forms/MedicationForm';
import AssignmentForm from './forms/AssignmentForm';

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

  const PopupForm = ({showForm, groupName} :{showForm: boolean, groupName: string}) => {
    if (!showForm) return null;
    return (
      <div className="fixed inset-0 bg-gray-800/70 flex items-center justify-center p-4">
        <div className="bg-white text-black border-4 border-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {
                groupName === "PATIENT"? "Add new Patient":
                groupName === "MEDICATION"? "Add new Medication":
                groupName === "ASSIGNMENT"? "Assign a medication":
                "ERROR: WRONG groupName provided to the PopupForm"
              }
            </h2>
            <button 
              onClick={() => {
                groupName === "PATIENT"? setShowPatientForm(false):
                groupName === "MEDICATION"? setShowMedicationForm(false):
                groupName === "ASSIGNMENT"? setShowAssignmentForm(false):
                "ERROR: WRONG groupName provided to the PopupForm"
                }}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          {
            groupName === "PATIENT"? 
            <PatientForm 
              onSuccess={() => {
                refreshData();
                setShowPatientForm(false);
              }} 
            />: groupName === "MEDICATION"?
            <MedicationForm 
              onSuccess={() => {
                refreshData();
                setShowMedicationForm(false);
              }} 
            />: groupName === "ASSIGNMENT"? 
            <AssignmentForm 
              onSuccess={() => {
                refreshData();
                setShowAssignmentForm(false);
              }} 
            />: "ERROR: WRONG groupName provided to the PopupForm"
          }
        </div>
      </div>
    );
  }

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
          <div key={patient.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">
              {patient.name} (DOB: {new Date(patient.dateOfBirth).toLocaleDateString()})
            </h2>
            
            {patient.assignments?.length ? (
              <div className="mt-3">
                <h3 className="font-medium mb-2">Medications:</h3>
                <ul className="space-y-3">
                  {patient.assignments.map((assignment) => (
                    <li key={assignment.id} className="border-l-4 border-blue-500 pl-3 py-1">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {assignment.medication.name} ({assignment.medication.dosage})
                        </span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          assignment.remainingDays && assignment.remainingDays <= 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {assignment.remainingDays && assignment.remainingDays > 0
                            ? `${assignment.remainingDays} days remaining`
                            : 'Treatment completed'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Frequency: {assignment.medication.frequency}
                      </div>
                      <div className="text-sm text-gray-500">
                        Started: {new Date(assignment.startDate).toLocaleDateString()} | 
                        Duration: {assignment.days} days
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500">No medications assigned</p>
            )}
          </div>
        ))}
      </div>

      <PopupForm
        showForm = {showPatientForm}
        groupName= 'PATIENT'
      />
      <PopupForm
        showForm = {showMedicationForm}
        groupName= 'MEDICATION'
      />
      <PopupForm
        showForm = {showAssignmentForm}
        groupName= 'ASSIGNMENT'
      />

    </div>
  );
}