import type { AssessmentsValue } from '../database';
import type {
	PaginatedResponse,
	AssessmentDetailResponse,
	AssessmentResponse,
	AssessmentCheckResponse,
	AssessmentRequestPostPayloadDto,
} from './types';

import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';

import {
	assessments,
	assessmentSections,
	assessmentQuestions,
	assessmentAnswers,
	DatabaseService,
} from '../database';
import { calcAssessmentScoreLevel2, calcDomainScores } from '@app/utils';

@Injectable()
export class AssessmentsService {
	constructor(private readonly databaseService: DatabaseService) {}

	async check(
		payload: AssessmentRequestPostPayloadDto,
	): Promise<AssessmentCheckResponse> {
		const db = this.databaseService.client;
		const answers = payload.answers;
		const questionIds = answers.map((answer) => answer.questionId);
		const questions = await db.query.assessmentQuestions.findMany({
			where: inArray(assessmentQuestions.id, questionIds),
			columns: {
				id: true,
				domain: true,
			},
		});
		const domainScores = calcDomainScores(questions, answers);
		const results = calcAssessmentScoreLevel2(domainScores);
		return { results };
	}

	async findAll(
		offset: number,
		limit: number,
	): Promise<PaginatedResponse<AssessmentResponse>> {
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

	async findOne(id: AssessmentsValue['id']): Promise<AssessmentDetailResponse> {
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
				},
			},
		});
		if (!assessment) {
			throw new NotFoundException(`Assessment with ID ${id} not found`);
		}

		const result: AssessmentDetailResponse = {
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
