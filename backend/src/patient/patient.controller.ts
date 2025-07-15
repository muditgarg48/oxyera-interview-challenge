import { Controller, Get, Post, Body, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { PatientService } from './patient.service';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @Post()
  create(@Body('name') name: string, @Body('dateOfBirth') dateOfBirth: Date) {
    if (!name || !dateOfBirth) {
      throw new NotFoundException('Name and date of birth are required');
    }
    return this.patientService.create(name, dateOfBirth);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientService.findOne(id);
  }
}
