import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication } from './medication.entity';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(Medication)
    private medicationRepo: Repository<Medication>,
  ) {}

  async create(name: string, dosage: string, frequency: string): Promise<Medication> {
    const entity = this.medicationRepo.create({ name, dosage, frequency });
    return this.medicationRepo.save(entity);
  }

  async findAll(): Promise<Medication[]> {
    return this.medicationRepo.find({relations: ['assignments']});
  }

  async findOne(id: number): Promise<Medication> {
    const medication = await this.medicationRepo.findOne({
      where: { id },
      relations: ['assignments'],
    });
    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }
    return medication;
  }
}
