import { PaginationQueryDto, AssessmentRequestPostPayloadDto } from './types';

import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Body,
} from '@nestjs/common';
import { AssessmentsService } from './assessments.service';

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Get('/')
  findAll(@Query() query: PaginationQueryDto) {
    return this.assessmentsService.findAll(query.offset, query.limit);
  }

  @Post('/')
  check(@Body() payload: AssessmentRequestPostPayloadDto) {
    return this.assessmentsService.check(payload);
  }

  @Get(':assessmentId')
  findOne(@Param('assessmentId', ParseIntPipe) assessmentId: number) {
    return this.assessmentsService.findOne(assessmentId);
  }
}
