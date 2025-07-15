import { Controller, Get, Post, Body, NotFoundException, ParseIntPipe, Param } from '@nestjs/common';
import { MedicationService } from './medication.service';

@Controller('medication')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Get()
  findAll() {
    return this.medicationService.findAll();
  }

  @Post()
  create(@Body('name') name: string, @Body('dosage') dosage: string, @Body('frequency') frequency: string) {
    if (!name || !dosage || !frequency) {
      throw new NotFoundException('Name, dosage and frequency are required');
    }
    return this.medicationService.create(name, dosage, frequency);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicationService.findOne(id);
  }
}
