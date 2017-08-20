const { resolve, basename } = require('path');
const { readdir, writeFile, ensureDir, ensureFile, remove } = require('fs-extra');

const MigrationStorage = require('./');

class DirectoryMigrationStorage extends MigrationStorage {
  static migrationTemplate() {
    return `module.exports = {
  up: function () {

  },
  down: function () {

  }
}`;
  }

  static bundleEntryTemplate(paths) {
    const migrations = paths.map((path) => (`{
  id: ${ JSON.stringify(basename(path, '.js')) },
  actions: require(${ JSON.stringify(path) })
}`));

    return `module.exports = [${ migrations.join(',') }];`;
  }

  constructor({
    path = resolve('./migrations'),
    migrationTemplate = DirectoryMigrationStorage.migrationTemplate,
    generateBundleEntry = false,
    bundleEntryPath = resolve(path, 'index.js'),
    bundleEntryTemplate = DirectoryMigrationStorage.bundleEntryTemplate,
    filter = (file) => (
      generateBundleEntry
        ? resolve(path, file) !== bundleEntryPath
        : true
    )
  } = {}) {
    super();

    this._path = path;
    this._migrationTemplate = migrationTemplate;
    this._generateBundleEntry = generateBundleEntry;
    this._bundleEntryPath = bundleEntryPath;
    this._bundleEntryTemplate = bundleEntryTemplate;
    this._filter = filter;
  }

  ensure() {
    return ensureDir(this._path).then(() => {
      if (!this._generateBundleEntry) {
        return;
      }

      return ensureFile(this._bundleEntryPath);
    });
  }

  destroy() {
    return remove(this._path).then(() => {
      if (!this._generateBundleEntry) {
        return;
      }

      return remove(this._bundleEntryPath);
    });
  }

  getAllMigrations() {
    return readdir(this._path).then((files) => (
      files.filter(this._filter).map((file) => ({
        id: basename(file, '.js'),
        actions: require(`${ this._path }/${ file }`)
      }))
    ));
  }

  addMigration(name) {
    return writeFile(`${ this._path }/${ name }.js`, this._migrationTemplate()).then(() => {
      if (!this._generateBundleEntry) {
        return;
      }

      return readdir(this._path).then((files) => {
        files = files.filter(this._filter).map((file) => (
          resolve(this._path, file)
        ));

        writeFile(this._bundleEntryPath, this._bundleEntryTemplate(files));
      });
    });
  }
}

module.exports = DirectoryMigrationStorage;
