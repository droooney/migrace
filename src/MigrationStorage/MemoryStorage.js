const MigrationStorage = require('./');

class MemoryStorage extends MigrationStorage {
  constructor({
    migrations = []
  } = {}) {
    super();

    this._migrations = migrations;
  }

  ensure() {
    return Promise.resolve();
  }

  destroy() {
    return Promise.resolve();
  }

  getAllMigrations() {
    return Promise.resolve(this._migrations);
  }

  addMigration(name) {
    this._migrations.push({
      id: name,
      actions: {
        up: () => Promise.resolve(),
        down: () => Promise.resolve()
      }
    });

    return Promise.resolve();
  }
}

module.exports = MemoryStorage;
