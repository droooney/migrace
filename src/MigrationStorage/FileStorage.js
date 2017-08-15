const { resolve } = require('path');
const { readFile, writeFile, remove } = require('fs-extra');

const MigrationStorage = require('./');
const { getTargetMagicNumber, TARGETS } = require('../utils');

class FileStorage extends MigrationStorage {
  constructor({
    path = resolve('./migrations.js'),
    target = 'es5'
  } = {}) {
    super();

    this._path = path;
    this._target = getTargetMagicNumber(target);
    this._constKind = this._target >= TARGETS.ES6
      ? 'const'
      : 'var';
  }

  _getStorageTemplate() {
    return `${ this._constKind } migrations = [];

module.exports = migrations;`;
  }

  _getMigrationTemplate(name) {
    return `

migrations.push({
  id: "${ name }",
  actions: {
    ${ this._getObjectAsyncMethodStart('up') }

    },
    ${ this._getObjectAsyncMethodStart('down') }

    }
  }
});`;
  }

  _getObjectAsyncMethodStart(name) {
    if (this._target >= TARGETS.ES8) {
      return `async ${ name }() {`;
    }

    if (this._target >= TARGETS.ES6) {
      return `${ name }() {`;
    }

    return `${ name }: function () {`;
  }

  ensure() {
    return readFile(this._path).catch(() => (
      writeFile(this._path, this._getStorageTemplate())
    ));
  }

  destroy() {
    return remove(this._path);
  }

  getAllMigrations() {
    return new Promise((resolve) => {
      resolve(require(this._path));
    });
  }

  addMigration(name) {
    return writeFile(this._path, this._getMigrationTemplate(name), {
      flags: 'a'
    });
  }
}

module.exports = FileStorage;
