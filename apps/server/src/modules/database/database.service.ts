import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Schema } from './schema';

import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { schema } from './schema';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  private readonly _pool: Pool;
  private readonly _client: NodePgDatabase<Schema>;

  constructor(private configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('POSTGRES_URL');
    this._pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 500,
      max: 10,
    });
    this._client = drizzle(this._pool, {
      schema,
      casing: 'snake_case',
    }) as NodePgDatabase<Schema>;
  }

  public get client(): NodePgDatabase<Schema> {
    return this._client;
  }

  async onApplicationShutdown(signal?: string) {
    return await this._pool.end();
  }
}
