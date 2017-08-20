const MigrationStorage = require('./');

class MemoryMigrationStorage extends MigrationStorage {
  constructor({
    migrations = []
  } = {}) {
    super();

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
        up: () => Promise.resolve(),
        down: () => Promise.resolve()
      }
    });
  }
}

module.exports = MemoryMigrationStorage;
