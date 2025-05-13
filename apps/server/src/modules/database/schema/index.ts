import * as assessments from './assessments.schema';
import * as assessmentSections from './assessmentSections.schema';
import * as assessmentQuestions from './assessmentQuestions.schema';
import * as assessmentAnswers from './assessmentAnswers.schema';

export const schema = {
  ...assessments,
  ...assessmentSections,
  ...assessmentQuestions,
  ...assessmentAnswers,
};

export type Schema = typeof schema;

export * from './assessments.schema';
export * from './assessmentSections.schema';
export * from './assessmentQuestions.schema';
export * from './assessmentAnswers.schema';
