import { relations } from 'drizzle-orm';
import {
	index,
	integer,
	pgTable,
	serial,
	text,
	varchar,
} from 'drizzle-orm/pg-core';

import { assessments } from './assessments.schema';

export const assessmentSections = pgTable(
	'assessment_sections',
	{
		id: serial('id').primaryKey(),
		assessmentId: integer('assessment_id')
			.references(() => assessments.id, { onDelete: 'cascade' })
			.notNull(),
		type: varchar('type', { length: 100 }).notNull(),
		title: text('title').notNull(),
		sortOrder: integer('sort_order').notNull(),
	},
	(table) => [index('sections_assessment_id_index').on(table.assessmentId)],
);

export const assessmentSectionsRelations = relations(assessmentSections, ({ one }) => ({
	assessment: one(assessments, {
		fields: [assessmentSections.assessmentId],
		references: [assessments.id],
	}),

}))