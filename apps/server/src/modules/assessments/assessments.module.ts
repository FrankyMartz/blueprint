import { Module } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { AssessmentsController } from './assessments.controller';

@Module({
  providers: [AssessmentsService],
  controllers: [AssessmentsController]
})
export class AssessmentsModule {}
