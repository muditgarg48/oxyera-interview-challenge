import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async create(name: string, dateOfBirth: Date): Promise<Patient> {
    const entity = this.patientRepo.create({ name, dateOfBirth });
    return this.patientRepo.save(entity);
  }

  async findAll(): Promise<Patient[]> {
    return this.patientRepo.find({
      relations: ['assignments', 'assignments.medication']
    });
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepo.findOne({
      where: { id },
      relations: ['assignments'],
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }
}
