const MetadataStorage = require('./MetadataStorage');
const MigrationStorage = require('./MigrationStorage');

const { MIGRATION_ERROR } = require('./errorTypes');

const {
  assert,
  validateMigrations
} = require('./utils');

class Migrator {
  constructor(options) {
    if (!options) {
      throw new Error('new Migrator() requires options param to be passed');
    }

    const {
      migrationStorage,
      metadataStorage,
      migrationCacheStorage,
      force = false,
      downgradeSupport = false
    } = options;

    assert(
      migrationStorage instanceof MigrationStorage,
      'options.migrationStorage must be an instance of MigrationStorage'
    );

    assert(
      metadataStorage instanceof MetadataStorage,
      'options.migrationStorage must be an instance of MetadataStorage'
    );

    if (downgradeSupport) {
      assert(
        migrationCacheStorage instanceof MetadataStorage,
        'If options.downgradeSupport is set to true, options.migrationCacheStorage must be an instance of MetadataStorage'
      );
    }

    options.downgradeSupport = !!downgradeSupport;
    options.force = !!force;

    this.options = options;
    this.metadataStorage = metadataStorage;
    this.migrationStorage = migrationStorage;
    this.migrationCacheStorage = migrationCacheStorage;
    this.downgradeSupport = options.downgradeSupport;
    this.force = options.force;
  }

  __validateMigrations__(migrations) {
    validateMigrations(migrations, this.options);
  }

  getAllMigrations() {
    return this.migrationStorage
      .__getAllMigrations__(this.options)
      .then((migrations) => {
        this.__validateMigrations__(migrations);

        return migrations;
      });
  }

  getMetadata() {
    return this.metadataStorage.__read__(this.options);
  }

  migrate(from, to) {
    return new Promise((resolve) => {
      const asyncIterator = this.migrateByOne(from, to);
      const migrations = [];

      resolve(
        asyncIterator
          .next()
          .then(({ value, done }) => {
            if (done) {
              return migrations;
            }

            migrations.push(value);

            return asyncIterator.next();
          })
          .catch((err) => {
            if (!err.code) {
              err.code = MIGRATION_ERROR;
              err.executedMigrations = migrations;
            }

            throw err;
          })
      );
    });
  }

  migrateByOne(from, to) {
    let thrown = false;
    let returned = false;
    let migrations;
    let metadata;
    let promise = Promise.all([
      this.getAllMigrations().then((_migrations) => {
        migrations = _migrations;

        // validate from and to points
      }),
      this.getMetadata().then((_metadata) => {
        metadata = _metadata;
      })
    ]);

    return {
      next() {
        if (!thrown || !returned) {
          return Promise.resolve({
            value: undefined,
            done: true
          });
        }
      },
      throw(error) {
        thrown = true;

        return Promise.reject(error);
      },
      return(value) {
        returned = true;

        return Promise.resolve({
          value,
          done: true
        });
      }
    };
  }
}

module.exports = Migrator;
