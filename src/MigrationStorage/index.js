class MigrationStorage {
  __ensure__(options) {
    return new Promise((resolve) => {
      resolve(this.ensure(options));
    });
  }

  __destroy__(options) {
    return this.__ensure__(options).then(() => this.destroy(options));
  }

  __getAllMigrations__(options) {
    return this.__ensure__(options).then(() => this.getAllMigrations(options));
  }

  __addMigration__(name, options) {
    return this.__ensure__(options).then(() => this.addMigration(name, options));
  }

  __generateBundleEntry__(options) {
    return this.__ensure__(options).then(() => this.generateBundleEntry(options));
  }

  ensure() {
    throw new Error('Abstract MigrationStorage#ensure method called');
  }

  destroy() {
    throw new Error('Abstract MigrationStorage#destroy method called');
  }

  getAllMigrations() {
    throw new Error('Abstract MigrationStorage#getAllMigrations method called');
  }

  addMigration() {
    throw new Error('Abstract MigrationStorage#addMigration method called');
  }

  generateBundleEntry() {
    throw new Error('Abstract MigrationStorage#generateBundleEntry method called');
  }
}

module.exports = MigrationStorage;
