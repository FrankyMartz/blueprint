import { configDotenv } from 'dotenv';
configDotenv({
	path: process.env.NODE_ENV === 'production' ? '../.env' : '../../../.env',
})
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app';
import { createAppOptions } from './utils/server.utils';

async function bootstrap() {
	const appOptions = await createAppOptions();
	const app = await NestFactory.create(AppModule, appOptions);

	app.setGlobalPrefix('api');
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
