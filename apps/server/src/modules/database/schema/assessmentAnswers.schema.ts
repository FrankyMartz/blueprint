import { sql } from 'drizzle-orm';
import {
	check,
	integer,
	pgTable,
	primaryKey,
	smallint,
	varchar,
} from 'drizzle-orm/pg-core';

import { assessmentSections } from './assessmentSections.schema';

export const assessmentAnswers = pgTable(
	'assessment_answers',
	{
		title: varchar('title', { length: 255 }).notNull(),
		value: smallint('value').notNull(),
		sectionId: integer('section_id')
			.references(() => assessmentSections.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(table) => [
		primaryKey({ name: 'id_key', columns: [table.sectionId, table.value] }),
		check('value_check', sql`${table.value} BETWEEN 0 AND 4`),
	],
);
