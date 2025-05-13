/* ========================================================================== *
 * Assessments: Types: Response
 * ========================================================================== */

import type {
	AssessmentAnswersValue,
	AssessmentQuestionsValue,
	AssessmentSectionsValue,
	AssessmentsValue,
} from '@app/modules/database';
import type { AssessmentLevelTwoValue } from '@blueprint/shared';

export interface PaginatedResponse<T> {
	data: T[];
	meta: {
		total: number;
		offset: number;
		limit: number;
	};
}

export type AssessmentResponse = AssessmentsValue;

export interface AssessmentDetailResponse {
	id: AssessmentsValue['id'];
	name: AssessmentsValue['name'];
	disorder: AssessmentsValue['disorder'];
	content?: {
		sections: AssessmentSectionResponse[];
		displayName: AssessmentsValue['displayName'];
	};
	fullName: AssessmentsValue['fullName'];
}

export interface AssessmentSectionResponse {
	id: AssessmentSectionsValue['id'];
	type: AssessmentSectionsValue['type'];
	title: AssessmentSectionsValue['title'];
	questions: QuestionResponse[];
	answers: AnswerResponse[];
}

export interface QuestionResponse {
	id: AssessmentQuestionsValue['id'];
	title: AssessmentQuestionsValue['title'];
}

export interface AnswerResponse {
	title: AssessmentAnswersValue['title'];
	value: AssessmentAnswersValue['value'];
}

export interface AssessmentCheckResponse {
	results: AssessmentLevelTwoValue[];
}
