import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './assignment.entity';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { PatientModule } from '../patient/patient.module';
import { MedicationModule } from '../medication/medication.module';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment]), PatientModule, MedicationModule],
  providers: [AssignmentService],
  controllers: [AssignmentController],
})
export class AssignmentModule {}
