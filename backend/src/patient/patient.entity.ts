import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Assignment } from '../assignment/assignment.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('date')
  dateOfBirth: Date;

  @OneToMany(() => Assignment, assignment => assignment.patient)
  assignments: Assignment[];
}
