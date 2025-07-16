'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '../constants';
import { Patient, Assignment } from '../types';
import PatientCard from './PatientCard';

export default function PatientsView ({ onPatientAdded, onAssignmentAdded }: {onPatientAdded?: ()=> void, onAssignmentAdded?: ()=> void}) {

    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (onPatientAdded || onAssignmentAdded) {
            refreshData();
        }
    }, [onPatientAdded, onAssignmentAdded]);

    if (loading) return <div>Loading...</div>;

    const PatientList = () => {
        return (
            <div className="grid gap-6">
            {patients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
            ))}
            </div>
        );
    }

    return (
        <PatientList/>
    );
}