import { configDotenv } from "dotenv";
configDotenv({
	path: '../../.env',
});
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

import {
	assessmentAnswers,
	assessmentQuestions,
	assessmentSections,
	assessments,
	schema,
} from '../src/modules/database';
import { ASSOCIATION_DOMAIN } from '@blueprint/shared';

async function seed() {
	// Initialize configuration
	const configService = new ConfigService();
	const connectionString = configService.getOrThrow<string>('POSTGRES_URL');

	// Connect to the database
	const pool = new Pool({
		connectionString,
		connectionTimeoutMillis: 5000,
		idleTimeoutMillis: 500,
		max: 10,
	});

	// Create a Drizzle client
	const db = drizzle(pool, {
		schema,
		casing: 'snake_case',
	});

	try {
		console.log('Seeding database...');

		// Insert assessment
		// Note: The payload in the issue description includes a specific ID "abcd-123",
		// but the schema defines the ID as a serial primary key. The database will
		// automatically generate an ID for the assessment.
		// If you need to use a specific ID, you would need to modify the schema.
		const [assessment] = await db.insert(assessments).values({
			name: 'BPDS',
			fullName: 'Blueprint Diagnostic Screener',
			disorder: 'Cross-Cutting',
			displayName: 'BDS',
		}).returning();

		console.log('Assessment created:', assessment);

		// Insert section
		const [section] = await db.insert(assessmentSections).values({
			assessmentId: assessment.id,
			type: 'standard',
			title: 'During the past TWO (2) WEEKS, how much (or how often) have you been bothered by the following problems?',
			sortOrder: 1,
		}).returning();

		console.log('Section created:', section);

		// Insert answers
		const answerValues = [
			{ title: 'Not at all', value: 0, sectionId: section.id },
			{ title: 'Rare, less than a day or two', value: 1, sectionId: section.id },
			{ title: 'Several days', value: 2, sectionId: section.id },
			{ title: 'More than half the days', value: 3, sectionId: section.id },
			{ title: 'Nearly every day', value: 4, sectionId: section.id },
		];

		await db.insert(assessmentAnswers).values(answerValues);
		console.log('Answers created');

		// Insert questions with appropriate domains
		const questionValues = [
			{
				title: 'Little interest or pleasure in doing things?',
				domain: ASSOCIATION_DOMAIN.depression,
				assessmentId: assessment.id,
				sectionId: section.id,
				sortOrder: 1,
			},
			{
				title: 'Feeling down, depressed, or hopeless?',
				domain: ASSOCIATION_DOMAIN.depression,
				assessmentId: assessment.id,
				sectionId: section.id,
				sortOrder: 2,
			},
			{
				title: 'Sleeping less than usual, but still have a lot of energy?',
				domain: ASSOCIATION_DOMAIN.mania,
				assessmentId: assessment.id,
				sectionId: section.id,
				sortOrder: 3,
			},
			{
				title: 'Starting lots more projects than usual or doing more risky things than usual?',
				domain: ASSOCIATION_DOMAIN.mania,
				assessmentId: assessment.id,
				sectionId: section.id,
				sortOrder: 4,
			},
			{
				title: 'Feeling nervous, anxious, frightened, worried, or on edge?',
				domain: ASSOCIATION_DOMAIN.anxiety,
				assessmentId: assessment.id,
				sectionId: section.id,
				sortOrder: 5,
			},
			{
				title: 'Feeling panic or being frightened?',
				domain: ASSOCIATION_DOMAIN.anxiety,
				assessmentId: assessment.id,
				sectionId: section.id,
				sortOrder: 6,
			},
			{
				title: 'Avoiding situations that make you feel anxious?',
				domain: ASSOCIATION_DOMAIN.anxiety,
				assessmentId: assessment.id,
				sectionId: section.id,
				sortOrder: 7,
			},
			{
				title: 'Drinking at least 4 drinks of any kind of alcohol in a single day?',
				domain: ASSOCIATION_DOMAIN.substanceUse,
				assessmentId: assessment.id,
				sectionId: section.id,
				sortOrder: 8,
			},
		];

		await db.insert(assessmentQuestions).values(questionValues);
		console.log('Questions created');

		console.log('Seeding completed successfully!');
	} catch (error) {
		console.error('Error seeding database:', error);
	} finally {
		// Close the database connection
		await pool.end();
	}
}

// Run the seed function
seed().catch(console.error);
