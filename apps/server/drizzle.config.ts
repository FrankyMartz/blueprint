import {configDotenv} from 'dotenv';
configDotenv({
	path: process.env.NODE_ENV === 'production' ? './.env' : '../../.env',
})
import { defineConfig } from 'drizzle-kit';
import * as process from 'node:process'

export default defineConfig({
	out: './drizzle',
	schema: './src/modules/database/schema',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.POSTGRES_URL as any,
	},
});
