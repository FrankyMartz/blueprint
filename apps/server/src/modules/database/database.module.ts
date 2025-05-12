import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { DatabaseProvider, DatabaseProviderName } from './database.provider';
import { DatabaseService } from './database.service';

@Module({
	imports: [ConfigModule],
	providers: [DatabaseProvider, DatabaseService],
	exports: [DatabaseProviderName, DatabaseService]
})
export class DatabaseModule {}
