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

  addMigration(name) {
    this._migrations.push({
      id: name,
      actions: {
        up() {},
        down() {}
      }
    });
  }

  generateBundleEntry() {}
}

module.exports = MemoryMigrationStorage;
