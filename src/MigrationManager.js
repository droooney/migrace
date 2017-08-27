const { resolve } = require('path');

const MigrationStorage = require('./MigrationStorage');
const Bundler = require('./Bundler');

const {
  assert,
  validateMigrations
} = require('./utils');

const MIGRATION_NAME_REGEX = /[a-z\d-]+/i;

const DEFAULT_BUNDLE_PATH = 'migrace/bundle.cache';

class MigrationManager {
  constructor(options) {
    if (!options) {
      throw new Error('new MigrationManager() requires options param to be passed');
    }

    const {
      migrationStorage,
      bundler,
      bundlePath = DEFAULT_BUNDLE_PATH,
      force = false,
      downgradeSupport = false
    } = options;

    assert(
      migrationStorage instanceof MigrationStorage,
      'options.migrationStorage must be an instance of MigrationStorage'
    );

    if (downgradeSupport) {
      assert(
        bundler instanceof Bundler,
        'If options.downgradeSupport is set to true, options.bundler must be an instance of Bundler'
      );

      assert(
        typeof bundlePath !== 'string',
        'If options.downgradeSupport is set to true, options.bundlePath must be a string'
      );
    }

    options.downgradeSupport = !!downgradeSupport;
    options.force = !!force;
    options.bundlePath = resolve(process.cwd(), bundlePath);

    this.options = options;
    this.migrationStorage = migrationStorage;
    this.downgradeSupport = options.downgradeSupport;
    this.force = options.force;
    this.bundler = bundler;
    this.bundlePath = options.bundlePath;
  }

  __validateMigrationName__(name) {
    if (!MIGRATION_NAME_REGEX.test(name)) {
      throw new Error('Migration should be non-empty string containing only letters (a-z), digits and dashes');
    }
  }

  __validateMigrations__(migrations) {
    validateMigrations(migrations, this.options);
  }

  __validateBundler__() {
    if (!(this.bundler instanceof Bundler)) {
      throw new Error('options.bundler must be an instance of Bundler');
    }
  }

  addMigration(name) {
    return new Promise((res) => {
      this.__validateMigrationName__(name);

      const id = Date.now();
      const fullId = id + name;

      res(
        this.migrationStorage
          .__addMigration__(fullId, this.options)
          .then(() => ({
            fullId,
            id,
            name
          }))
      );
    });
  }

  getAllMigrations() {
    return this.migrationStorage
      .__getAllMigrations__(this.options)
      .then((migrations) => {
        this.__validateMigrations__(migrations);

        return migrations;
      });
  }

  generateBundleEntry() {
    return this.migrationStorage.__generateBundleEntry__(this.options);
  }

  generateBundle() {
    return this
      .generateBundleEntry()
      .then((entryPath) => {
        this.__validateBundler__();

        return this.bundler.__generateBundle__(entryPath, this.options);
      });
  }

  validateBundle() {
    return new Promise((resolve) => {
      delete require.cache[this.bundlePath];

      this.__validateMigrations__(require(this.bundlePath));

      resolve();
    });
  }

  validateMigrations() {
    return this.migrationStorage
      .__getAllMigrations__(this.options)
      .then((migrations) => {
        this.__validateMigrations__(migrations);
      });
  }
}

module.exports = MigrationManager;
