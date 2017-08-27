import { Migration } from './common';
import { MetadataStorage } from './MetadataStorage';

export interface MigratorOptions {
  migrations?: Migration[];
  migrationStorage: MetadataStorage;
  migrationCacheStorage?: MetadataStorage;
  downgradeSupport?: boolean;
}

export class Migrator {
  public constructor(options: MigratorOptions);
}
