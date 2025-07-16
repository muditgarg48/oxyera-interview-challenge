'use client';

import PatientForm from '../forms/PatientForm';
import MedicationForm from '../forms/MedicationForm';
import AssignmentForm from '../forms/AssignmentForm';
import { FormType } from '../types';

export default function PopupForm({ 
    showForm, 
    groupName, 
    onClose, 
    onSuccess 
  }: {
    showForm: boolean;
    groupName: FormType;
    onClose: () => void;
    onSuccess: () => void;
  }) {
  if (!showForm) return null;

  const titles = {
    PATIENT: 'Add new Patient',
    MEDICATION: 'Add new Medication',
    ASSIGNMENT: 'Assign a medication'
  };

  return (
    <div className="fixed inset-0 bg-gray-800/70 flex items-center justify-center p-4">
      <div className="bg-white text-black border-4 border-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{titles[groupName]}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        {groupName === 'PATIENT' && <PatientForm onSuccess={onSuccess} />}
        {groupName === 'MEDICATION' && <MedicationForm onSuccess={onSuccess} />}
        {groupName === 'ASSIGNMENT' && <AssignmentForm onSuccess={onSuccess} />}
      </div>
    </div>
  );
}