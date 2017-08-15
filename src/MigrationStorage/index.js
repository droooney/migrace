class MigrationStorage {
  __destroy__() {
    return this.ensure().then(() => this.destroy());
  }

  __getAllMigrations__() {
    return this.ensure().then(() => this.getAllMigrations());
  }

  __addMigration__(name) {
    return this.ensure().then(() => this.addMigration(name));
  }

  ensure() {
    return Promise.reject(new Error('Abstract MigrationStorage#ensure method called'));
  }

  destroy() {
    return Promise.reject(new Error('Abstract MigrationStorage#destroy method called'));
  }

  getAllMigrations() {
    return Promise.reject(new Error('Abstract MigrationStorage#getAllMigrations method called'));
  }

  addMigration() {
    return Promise.reject(new Error('Abstract MigrationStorage#addMigration method called'));
  }
}

module.exports = MigrationStorage;
