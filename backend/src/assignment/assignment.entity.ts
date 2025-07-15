import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Medication } from '../medication/medication.entity';
import { Patient } from '../patient/patient.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  startDate: Date;
  
  @Column('int')
  days: number;
  
  @ManyToOne(() => Patient, patient => patient.assignments)
  patient: Patient;

  @ManyToOne(() => Medication, medication => medication.assignments)
  medication: Medication;
}
