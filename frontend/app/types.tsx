export type SampleEntity = { id: number; name: string };

export type Patient = {
    id: number;
    name: string;
    dateOfBirth: string;
    assignments: Assignment[];
};

export type Medication = {
    id: number;
    name: string;
    dosage: string;
    frequency: string;
};

export type Assignment = {
    id: number;
    startDate: string;
    days: number;
    patient: Patient;
    medication: Medication;
    remainingDays?: number;
};