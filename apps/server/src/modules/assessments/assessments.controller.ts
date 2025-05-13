import {
  PaginationQueryDto,
} from './types';

import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
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
  check() {
    // This method is not implemented yet
    return { message: 'This endpoint is not implemented yet' };
  }

  @Get(':assessmentId')
  findOne(@Param('assessmentId', ParseIntPipe) assessmentId: number) {
    return this.assessmentsService.findOne(assessmentId);
  }
}
