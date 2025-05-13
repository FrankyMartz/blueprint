import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
} from 'drizzle-orm/pg-core';

import { assessments } from './assessments.schema';
import { assessmentSections } from './assessmentSections.schema';
import { ASSOCIATION_DOMAIN } from '@blueprint/shared';

export const associationDomain = pgEnum('association_domain' as const, [
  ASSOCIATION_DOMAIN.depression,
  ASSOCIATION_DOMAIN.mania,
  ASSOCIATION_DOMAIN.anxiety,
  ASSOCIATION_DOMAIN.substanceUse,
]);

export const assessmentQuestions = pgTable(
  'assessment_questions',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    domain: associationDomain().notNull(),
    assessmentId: integer('assessment_id')
      .references(() => assessments.id, { onDelete: 'cascade' })
      .notNull(),
    sectionId: integer('section_id')
      .references(() => assessmentSections.id, { onDelete: 'cascade' })
      .notNull(),
    sortOrder: integer('sort_order').notNull(),
  },
  (table) => [
    index('questions_assessment_id_index').on(table.assessmentId),
    index('questions_section_id_index').on(table.sectionId),
  ],
);

export const assessmentQuestionsRelations = relations(
  assessmentQuestions,
  ({ one }) => ({
    section: one(assessmentSections, {
      fields: [assessmentQuestions.assessmentId, assessmentQuestions.sectionId],
      references: [assessmentSections.assessmentId, assessmentSections.id],
    }),
  }),
);

export type AssessmentQuestions = typeof assessmentQuestions;
export type AssessmentQuestionsInput = AssessmentQuestions['$inferInsert'];
export type AssessmentQuestionsValue = AssessmentQuestions['$inferSelect'];
