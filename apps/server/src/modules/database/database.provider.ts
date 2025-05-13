import type { Provider } from '@nestjs/common';

import { DatabaseService } from './database.service';

export const DatabaseProviderName = 'DatabaseProvider';

export const DatabaseProvider: Provider = {
  provide: DatabaseProviderName,
  inject: [DatabaseService],
  useFactory(databaseService: DatabaseService) {
    return databaseService.client;
  },
};
