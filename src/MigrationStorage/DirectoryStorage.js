const { resolve, basename, dirname, relative } = require('path');
const { readdir, writeFile, ensureDir, remove } = require('fs-extra');

const MigrationStorage = require('./');

class DirectoryMigrationStorage extends MigrationStorage {
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
      path = resolve('./migrace/migrations'),
      extension = 'js',
      bundleEntryPath = resolve(path, `index.${ extension }`)
    } = options;

    this._path = path;
    this._extension = extension;
    this._bundleEntryPath = bundleEntryPath;
  }

  filter(file, options) {
    return options.downgradeSupport
      ? resolve(this._path, file) !== bundleEntryPath
      : true;
  }

  getMigrationTemplate(options) {
    const actions = ['up', 'down'];

    if (options.force) {
      actions.push('wasExecuted');
    }

    const actionsString = actions.map((action) => (
      `  ${ action }: function () {

  }`
    )).join(',\n');

    return `module.exports = {
${ actionsString }
}`;
  }

  getBundleEntryTemplate() {
    const migrations = paths.map((path) => (`{
  id: ${ JSON.stringify(basename(path, `.${ this._extension }`)) },
  actions: require(${ JSON.stringify(path) })
}`));

    return `module.exports = [${ migrations.join(',') }];`;
  }

  ensure(options) {
    return ensureDir(this._path).then(() => {
      if (!options.downgradeSupport) {
        return;
      }

      return writeFile(this._bundleEntryPath, this.getBundleEntryTemplate([], options), {
        flags: 'wx'
      });
    });
  }

  destroy(options) {
    return remove(this._path).then(() => {
      if (!options.downgradeSupport) {
        return;
      }

      return remove(this._bundleEntryPath);
    });
  }

  getAllMigrations(options) {
    return readdir(this._path).then((files) => (
      files.filter((file) => this.filter(file, options)).map((file) => ({
        id: basename(file, `.${ this._extension }`),
        actions: require(`${ this._path }/${ file }`)
      }))
    ));
  }

  addMigration(name, options) {
    return writeFile(`${ this._path }/${ name }.${ this._extension }`, this.getMigrationTemplate(options)).then(() => (
      this.generateBundleEntry(options)
    ));
  }

  generateBundleEntry(options) {
    if (!options.downgradeSupport) {
      return;
    }

    return readdir(this._path)
      .then((files) => {
        files = files.filter((file) => this.filter(file, options)).map((file) => (
          DirectoryMigrationStorage._relativeFilename(
            this._bundleEntryPath,
            resolve(this._path, file)
          )
        ));

        return writeFile(this._bundleEntryPath, this.getBundleEntryTemplate(files, options));
      })
      .then(() => this._bundleEntryPath);
  }
}

module.exports = DirectoryMigrationStorage;
