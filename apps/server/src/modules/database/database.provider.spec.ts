import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseService } from './database.service';
import { DatabaseProvider, DatabaseProviderName } from './database.provider';

type DatabaseProviderType = typeof DatabaseProvider;

describe('DatabaseProvider', () => {
  let provider: DatabaseProviderType;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [DatabaseService, DatabaseProvider],
    }).compile();

    provider = module.get<DatabaseProviderType>(DatabaseProviderName);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
