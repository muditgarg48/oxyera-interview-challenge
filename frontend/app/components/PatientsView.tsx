'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '../constants';
import { Patient, Assignment } from '../types';
import PatientCard from './PatientCard';

export default function PatientsView ({ onPatientAdded, onAssignmentAdded }: {onPatientAdded?: ()=> void, onAssignmentAdded?: ()=> void}) {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPatients = async () => {
        try {
            const res = await fetch(`${API_URL}/patient`);
            const data = await res.json();
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
            setFilteredPatients(patientsWithRemainingDays);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        if (onPatientAdded || onAssignmentAdded) {
            fetchPatients();
        }
    }, [onPatientAdded, onAssignmentAdded]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredPatients(patients);
        } else {
            const filtered = patients.filter(patient =>
                patient.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPatients(filtered);
        }
    }, [searchTerm, patients]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search patients by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                    className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>
            <div className="grid gap-6">
                {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                        <PatientCard key={patient.id} patient={patient} />
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        {searchTerm ? 'No patients match your search' : 'No patients found'}
                    </div>
                )}
            </div>
        </div>
    );
}