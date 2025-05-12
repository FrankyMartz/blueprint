import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

import { assessmentSections } from './assessmentSections.schema';

export const assessments = pgTable('assessments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  disorder: varchar('disorder', { length: 100 }).notNull(),
  displayName: varchar('display_name', { length: 100 }).notNull(),
});

export const assessmentsRelations = relations(assessments, ({ many }) => ({
  sections: many(assessmentSections),
}));