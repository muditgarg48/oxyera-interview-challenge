// components/MedicationCard.tsx
'use client';

import { Medication, Patient, Assignment } from '../types';

export default function MedicationCard({ medication, assignedPatients }: {
    medication: Medication;
    assignedPatients: Patient[];
  }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
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
}