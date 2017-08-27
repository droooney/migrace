const MigrationStorage = require('./');

class MemoryMigrationStorage extends MigrationStorage {
  constructor(options = {}) {
    super();

    const {
      migrations = []
    } = options;

    this._migrations = migrations;
  }

  ensure() {}

  destroy() {
    this._migrations = [];
  }

  getAllMigrations() {
    return this._migrations;
  }

  addMigration() {
    throw new Error('MemoryMigrationStorage doesn\'t generate new migrations');
  }

  generateBundleEntry() {
    throw new Error('MemoryMigrationStorage doesn\'t generate bundle entry files');
  }
}

module.exports = MemoryMigrationStorage;
