import type { AssessmentQuestionsValue } from '@app/modules/database';
import type {
  AssociationDomainValue,
  AssessmentLevelTwoValue,
} from '@blueprint/shared';

import { ASSOCIATION_DOMAIN, ASSESSMENT_LEVEL_TWO } from '@blueprint/shared';

type AssessmentQuestion = Pick<AssessmentQuestionsValue, 'id' | 'domain'>;
interface AnswerDto {
  questionId: AssessmentQuestionsValue['id'];
  value: number;
}

export function calcDomainScores(
  questions: AssessmentQuestion[],
  answers: AnswerDto[],
): Map<AssociationDomainValue, number> {
  const questionDomainMap = new Map(
    questions.map((question) => [question.id, question.domain]),
  );
  const result = new Map<AssociationDomainValue, number>();
  for (const answer of answers) {
    const domain = questionDomainMap.get(answer.questionId);
    if (domain) {
      const prevValue = result.get(domain) ?? 0;
      result.set(domain, prevValue + answer.value);
    }
  }
  return result;
}

export function calcAssessmentScoreLevel2(
  domainScores: Map<AssociationDomainValue, number>,
): AssessmentLevelTwoValue[] {
  const results = new Set<AssessmentLevelTwoValue>();
  for (const [aDomain, aValue] of domainScores) {
    switch (aDomain) {
      case ASSOCIATION_DOMAIN.depression: {
        if (aValue >= 2) results.add(ASSESSMENT_LEVEL_TWO.phq9);
        break;
      }
      case ASSOCIATION_DOMAIN.mania: {
        if (aValue >= 2) results.add(ASSESSMENT_LEVEL_TWO.asrm);
        break;
      }
      case ASSOCIATION_DOMAIN.anxiety: {
        if (aValue >= 2) results.add(ASSESSMENT_LEVEL_TWO.phq9);
        break;
      }
      case ASSOCIATION_DOMAIN.substanceUse: {
        if (aValue >= 1) results.add(ASSESSMENT_LEVEL_TWO.assist);
        break;
      }
    }
  }
  return Array.from(results);
}
