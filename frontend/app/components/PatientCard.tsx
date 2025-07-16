'use client';

import { Patient, Assignment } from '../types';
import ProgressCircle from './ProgressCircle';

export default function PatientCard({ patient }: {patient: Patient}) {
  if (!patient.assignments) return null;

  const dob = new Date(patient.dateOfBirth).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const age = Date.now() - new Date(patient.dateOfBirth).getTime();
  const age_y = Math.floor(age/(1000*60*60*24*365));

  const Assignment = ({assignment}: {assignment: Assignment}) => {
    const totalDays = assignment.days;
    const remainingDays = assignment.remainingDays ?? totalDays;
    const daysCompleted = totalDays - remainingDays;
    const frequency = Number(assignment.medication?.frequency) || null;

    const startDate = new Date(assignment.startDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return (
      <div className="border rounded-lg p-3 flex justify-between items-center">
        <div className="flex-1">
          <div className="font-medium">
            {assignment.medication?.name || 'Unknown'} ({assignment.medication?.dosage || 'N/A'})
          </div>
          <div className="text-sm text-gray-600">
            Frequency: {frequency || "N/A"}
          </div>
          <div className="text-xs text-gray-500">
            Started: {startDate} | Duration: {totalDays} days
          </div>
        </div>
        
        <ProgressCircle 
          total={totalDays} 
          completed={daysCompleted}
          showTooltip={true}
          frequency={frequency?? 0}
        />
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm mb-4">
      {/* Patient Header */}
      <div className="mb-3">
        <h2 className="text-xl font-light">{patient.name}</h2>
        <p className="text-sm text-gray-600">
          Born: {dob} ({age_y} years old)
        </p>
      </div>

      {/* Medications Grid */}
      {patient.assignments.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {patient.assignments.map((assignment) => <Assignment assignment={assignment}/>)}
        </div>
      ) : (
        <p className="text-gray-500">No medications assigned</p>
      )}
    </div>
  );
}