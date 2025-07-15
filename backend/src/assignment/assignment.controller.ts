import { Controller, Get, Post, Body, NotFoundException, ParseIntPipe, Param } from '@nestjs/common';
import { AssignmentService } from './assignment.service';

@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Get()
  findAll() {
    return this.assignmentService.findAll();
  }

  @Post()
  create(@Body('patientId') patientId: number, @Body('medicationId') medicationId: number, @Body('startDate') startDate: Date, @Body('days') days: number,) {
    if (!patientId || !medicationId || !startDate || !days) {
      throw new NotFoundException('All fields are required');
    }
    return this.assignmentService.create(patientId, medicationId, startDate, days);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentService.findOne(id);
  }
}
