import { Migration } from './common';

export type BundleEntryTemplateFunction = (name: string) => string;
export type FileMigrationTemplateFunction = () => string;
export type FileTemplateFunction = () => string;
export type StatementMigrationTemplateFunction = (name: string) => string;

export interface MigrationStorageOptions {}

export interface DirectoryMigrationStorageOptions extends MigrationStorageOptions {
  path?: string;
  migrationTemplate?: FileMigrationTemplateFunction;
  generateBundleEntry?: boolean;
  bundleEntryPath?: string;
  bundleEntryTemplate?: BundleEntryTemplateFunction;
  filter?: (path: string) => any;
}
export interface FileMigrationStorageOptions extends MigrationStorageOptions {
  path?: string;
  fileTemplate?: () => string;
  migrationTemplate?: (name: string) => string;
}
export interface MemoryMigrationStorageOptions extends MigrationStorageOptions {
  migrations?: Migration[];
}

export class MigrationStorage {
  private __destroy__(): Promise;
  private __getAllMigrations__(): Promise<Migration[]>;
  private __addMigration__(name: string): Promise;
  private __generateBundleEntry__(): Promise;

  public constructor(options?: MigrationStorageOptions);

  public ensure(): Promise;
  public destroy(): Promise;
  public getAllMigrations(): Promise<Migration[]>;
  public addMigration(): Promise;
  public generateBundleEntry(): Promise;
}

export class DirectoryMigrationStorage extends MigrationStorage {
  private static _relativeFilename(from: string, to: string): string;

  public static migrationTemplate: FileMigrationTemplateFunction;
  public static bundleEntryTemplate: BundleEntryTemplateFunction;

  public constructor(options?: DirectoryMigrationStorageOptions = {});
}
export class FileMigrationStorage extends MigrationStorage {
  public static fileTemplate: FileTemplateFunction;
  public static migrationTemplate: StatementMigrationTemplateFunction;

  public constructor(options?: FileMigrationStorageOptions = {});
}
export class MemoryMigrationStorage extends MigrationStorage {
  public constructor(options?: MemoryMigrationStorageOptions = {});
}
