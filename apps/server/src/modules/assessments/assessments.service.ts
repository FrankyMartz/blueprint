import type { AssessmentsInput } from '../database';
import type {
  PaginatedResponse,
  AssessmentResponse,
  AssessmentListResponse,
} from './types';

import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import {
  assessments,
  assessmentSections,
  assessmentQuestions,
  assessmentAnswers,
  DatabaseService,
} from '../database';

@Injectable()
export class AssessmentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(
    offset: number,
    limit: number,
  ): Promise<PaginatedResponse<AssessmentListResponse>> {
    const db = this.databaseService.client;
    const queryCount = db.$count(assessments);
    const queryResult = db.query.assessments.findMany({
      offset,
      limit,
    });
    const [result, count] = await Promise.all([queryResult, queryCount]);
    return {
      data: result,
      meta: {
        total: count,
        offset,
        limit,
      },
    };
  }

  async findOne(id: NonNullable<AssessmentsInput['id']>): Promise<AssessmentResponse> {
    const db = this.databaseService.client;

    const assessment = await db.query.assessments.findFirst({
      where: eq(assessments.id, id),
      with: {
        sections: {
          orderBy: assessmentSections.sortOrder,
          columns: {
            id: true,
            type: true,
            title: true,
          },
          with: {
            questions: {
              columns: {
                id: true,
                title: true,
              },
              orderBy: assessmentQuestions.sortOrder,
            },
            answers: {
              columns: {
                title: true,
                value: true,
              },
              orderBy: assessmentAnswers.value,
            },
          },
        }
      }
    });
    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }

    const result: AssessmentResponse = {
        id: assessment.id,
        name: assessment.name,
        disorder: assessment.disorder,
        content: {
          sections: assessment.sections,
          displayName: assessment.displayName,
        },
        fullName: assessment.fullName,
    };
    return result;
  }
}
