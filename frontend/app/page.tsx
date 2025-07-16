'use client';

import { useState } from 'react';
import PopupForm from './components/PopupForm';
import PatientsView from './components/PatientsView';
import MedicationsView from './components/MedicationsView';
import { ViewType } from './types';

export default function Home() {
  
  // const [loading, setLoading] = useState(true);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('PATIENTS');

  const refreshData = () => {
    // setLoading(true);
    // fetchPatients();
  };

  // if (loading) return <div>Loading...</div>;

  const ActionBar = () => {
    return (
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <div className="flex gap-4">
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
        <div className="ml-auto">
          <button
            onClick={() => setCurrentView(currentView === 'PATIENTS' ? 'MEDICATIONS' : 'PATIENTS')}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            {currentView === 'PATIENTS' ? 'View Medications' : 'View Patients'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Patient Management</h1>
      <ActionBar/>
      {currentView === 'PATIENTS' ? (
        <PatientsView 
          onPatientAdded={refreshData}
          onAssignmentAdded={refreshData}
        />
      ) : (
        <MedicationsView 
          onMedicationAdded={refreshData}
          onAssignmentAdded={refreshData}
        />
      )}
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