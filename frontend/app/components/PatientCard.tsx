'use client';

import { Patient } from '../types';

export default function PatientCard({ patient }: {patient: Patient}) {
  if (!patient.assignments) return null;

  return (
    <div className="border rounded-lg p-4 shadow-sm mb-4">
      {/* Patient Header */}
      <div className="mb-3">
        <h2 className="text-xl font-light">{patient.name}</h2>
        <p className="text-sm text-gray-600">
          Born: {new Date(patient.dateOfBirth).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Medications Grid */}
      {patient.assignments.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {patient.assignments.map((assignment) => {
            const remainingDays = assignment.remainingDays ?? assignment.days;
            const daysCompleted = assignment.days - remainingDays;
            const progressPercentage = Math.min(100, Math.max(0, 
              (daysCompleted / assignment.days) * 100
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
              <div 
                key={assignment.id} 
                className="border rounded-lg p-3 flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="font-medium">
                    {assignment.medication?.name || 'Unknown'} ({assignment.medication?.dosage || 'N/A'})
                  </div>
                  <div className="text-sm text-gray-600">
                    Frequency: {assignment.medication?.frequency || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Started: {new Date(assignment.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })} | Duration: {assignment.days} days
                  </div>
                </div>
                
                <div className="relative group ml-3">
                  <div className="relative w-12 h-12">
                    <div className="absolute w-full h-full rounded-full border-4 border-gray-200"></div>
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
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <div className="absolute hidden group-hover:block z-10 w-48 p-2 bg-white border border-gray-200 rounded shadow-lg text-sm mt-1 right-0">
                      <div className="font-semibold text-gray-800 mb-1">Progress</div>
                      <div className="text-gray-600">
                        {remainingDays} days remaining
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No medications assigned</p>
      )}
    </div>
  );
}