const { resolve, basename, dirname, relative } = require('path');
const { readdir, writeFile, ensureDir, remove } = require('fs-extra');

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

  static _relativeFilename(path1, path2) {
    let path = relative(dirname(path1), path2);

    if (path[0] !== '.' && path[0] !== '/') {
      path = `./${ path }`;
    }

    return path;
  }

  constructor(options = {}) {
    super();

    const {
      path = resolve('./migrations'),
      migrationTemplate = this.constructor.migrationTemplate,
      generateBundleEntry = false,
      bundleEntryPath = resolve(path, 'index.js'),
      bundleEntryTemplate = this.constructor.bundleEntryTemplate,
      filter = (file) => (
        generateBundleEntry
          ? resolve(path, file) !== bundleEntryPath
          : true
      )
    } = options;

    this._path = path;
    this._migrationTemplate = migrationTemplate;
    this._generateBundleEntry = generateBundleEntry;
    this._bundleEntryPath = bundleEntryPath;
    this._bundleEntryTemplate = bundleEntryTemplate;
    this._filter = filter;
  }

  ensure() {
    return ensureDir(this._path).then(() => (
      this.generateBundleEntry()
    ));
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
    return writeFile(`${ this._path }/${ name }.js`, this._migrationTemplate()).then(() => (
      this.generateBundleEntry()
    ));
  }

  generateBundleEntry() {
    if (!this._generateBundleEntry) {
      return;
    }

    return readdir(this._path).then((files) => {
      files = files.filter(this._filter).map((file) => (
        DirectoryMigrationStorage._relativeFilename(
          this._bundleEntryPath,
          resolve(this._path, file)
        )
      ));

      return writeFile(this._bundleEntryPath, this._bundleEntryTemplate(files));
    });
  }
}

module.exports = DirectoryMigrationStorage;
