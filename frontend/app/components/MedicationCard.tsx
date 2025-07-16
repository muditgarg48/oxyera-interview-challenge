// components/MedicationCard.tsx
'use client';

import { Medication, Patient, Assignment } from '../types';

export default function MedicationCard({ medication, assignedPatients }: {
  medication: Medication;
  assignedPatients: Patient[];
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365));
  };

  const SingleAssignment = ({ assignment }: { assignment: Assignment & { assignmentNumber: number } }) => {
    const totalDays = assignment.days;
    const remainingDays = assignment.remainingDays ?? totalDays;
    const daysCompleted = totalDays - remainingDays;
    const progressPercentage = Math.min(100, Math.max(0, 
      (daysCompleted / totalDays) * 100
    ));
    
    let progressColor;
    if (progressPercentage <= 25) {
      progressColor = 'bg-gray-200';
    } else if (progressPercentage <= 60) {
      progressColor = 'bg-orange-300';
    } else {
      progressColor = 'bg-green-400';
    }

    return (
      <div key={assignment.id} className="border rounded-lg p-3 flex justify-between items-center">
        <div className="flex-1">
          <div className="font-medium">
            Assignment {assignment.assignmentNumber}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Started:</span> {formatDate(assignment.startDate)}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Duration:</span> {totalDays} days
          </div>
        </div>
        
        <div className="relative group ml-3">
          <div className="relative w-12 h-12">
            <div className={`absolute w-full h-full rounded-full border-2 ${progressColor}`}></div>
            <div 
              className={`absolute w-full h-full rounded-full ${progressColor}`}
              style={{
                clipPath: `circle(${progressPercentage}% at 50% 50%)`,
                transform: 'rotate(-90deg)',
                transformOrigin: 'center'
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-800">
                {daysCompleted}/{totalDays}
              </span>
            </div>
            <div className="absolute hidden group-hover:block z-10 w-48 p-2 bg-white border border-gray-200 rounded shadow-lg text-xs mt-1 right-0">
              <div className="font-semibold text-gray-800 mb-1">
                Progress: {Math.round(progressPercentage)}%
              </div>
              <div className="text-gray-600">
                {remainingDays} days remaining
              </div>
              {medication.frequency && (
                <div className="text-gray-600">
                  {daysCompleted * Number(medication.frequency)}/{totalDays * Number(medication.frequency)} doses completed
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SinglePatient = ({ patient, patientAssignments }: { patient: Patient; patientAssignments: (Assignment & { assignmentNumber: number })[] }) => {
    return (
      <div key={patient.id} className="border rounded-lg p-4 shadow-sm">
        <div className="mb-3">
          <h3 className="text-lg font-medium">{patient.name}</h3>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Age:</span> {calculateAge(patient.dateOfBirth)} years | 
            <span className="font-medium"> DOB:</span> {formatDate(patient.dateOfBirth)}
          </div>
          <div className="text-sm text-gray-600">
            {patientAssignments.length} {patientAssignments.length === 1 ? 'assignment' : 'assignments'} of this medication
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {patientAssignments.map((assignment) => (
            <SingleAssignment key={assignment.id} assignment={assignment} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm mb-4">
      {/* Medication Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{medication.name}</h2>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Dosage:</span> {medication.dosage} | 
          <span className="font-medium"> Frequency:</span> {medication.frequency} {medication.frequency === '1' ? 'time/day' : 'times/day'}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Assigned to:</span> {assignedPatients.length} {assignedPatients.length === 1 ? 'patient' : 'patients'}
        </div>
      </div>

      {/* Patients Grid */}
      {assignedPatients.length > 0 ? (
        <div className="grid gap-4">
          {assignedPatients.map((patient) => {
            const patientAssignments = patient.assignments
              ?.filter(a => a.medication?.id === medication.id)
              .map((assignment, index) => ({
                ...assignment,
                assignmentNumber: index + 1
              })) || [];
              
            return (
              <SinglePatient 
                key={patient.id} 
                patient={patient} 
                patientAssignments={patientAssignments} 
              />
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No patients assigned to this medication</p>
      )}
    </div>
  );
}