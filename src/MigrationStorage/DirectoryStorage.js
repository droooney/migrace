const { resolve, basename } = require('path');
const { readdir, writeFile, mkdirs, remove } = require('fs-extra');

const MigrationStorage = require('./');
const { getTargetMagicNumber, getObjectAsyncMethodStart } = require('../utils');

class DirectoryStorage extends MigrationStorage {
  constructor({
    path = resolve('./migrations'),
    target = 'es5'
  } = {}) {
    super();

    this._path = path;
    this._target = getTargetMagicNumber(target);
  }

  _getMigrationTemplate() {
    return `module.exports = {
  ${ this._getObjectAsyncMethodStart('up') }

  },
  ${ this._getObjectAsyncMethodStart('down') }

  }
}`;
  }

  _getObjectAsyncMethodStart(name) {
    return getObjectAsyncMethodStart(this._target, name);
  }

  ensure() {
    return readdir(this._path).catch(() => (
      mkdirs(this._path)
    ));
  }

  destroy() {
    return remove(this._path);
  }

  getAllMigrations() {
    return readdir(this._path).then((files) => (
      files.map((file) => ({
        id: basename(file, '.js'),
        actions: require(`${ this._path }/${ file }`)
      }))
    ));
  }

  addMigration(name) {
    return writeFile(`${ this._path }/${ name }.js`, this._getMigrationTemplate());
  }
}

module.exports = DirectoryStorage;
