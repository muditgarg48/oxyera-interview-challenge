import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { PatientService } from '../patient/patient.service';
import { MedicationService } from '../medication/medication.service';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
    private patientService: PatientService,
    private medicationService: MedicationService,
  ) {}

  async create(patientId: number, medicationId: number, startDate: Date, days: number): Promise<Assignment> {
    const patient = await this.patientService.findOne(patientId);
    const medication = await this.medicationService.findOne(medicationId);
    const entity = this.assignmentRepo.create({ startDate, days, patient, medication });
    return this.assignmentRepo.save(entity);
  }

  async findAll(): Promise<Assignment[]> {
    return this.assignmentRepo.find({relations: ['assignments']});
  }

  async findOne(id: number): Promise<Assignment> {
    const assignment = await this.assignmentRepo.findOne({
      where: { id },
      relations: ['patient', 'medication'],
    });
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    return assignment;
  }

  async getRemainingDays(id: number): Promise<number> {
    const assignment = await this.findOne(id);
    const endDate = new Date(assignment.startDate);
    endDate.setDate(endDate.getDate() + assignment.days);
    const today = new Date();
    return Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }
}
