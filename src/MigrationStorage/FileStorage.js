const { resolve } = require('path');
const { readFile, writeFile, remove } = require('fs-extra');

const MigrationStorage = require('./');

class FileMigrationStorage extends MigrationStorage {
  constructor(options = {}) {
    super();

    const {
      path = resolve('./migrace/migrations.js')
    } = options;

    this._path = path;
  }

  getFileTemplate() {
    return `var migrations = [];

module.exports = migrations;`;
  }

  getMigrationTemplate(name, options) {
    const actions = ['up', 'down'];

    if (options.force) {
      actions.push('wasExecuted');
    }

    const actionsString = actions.map((action) => (
      `    ${ action }: function () {

    }`
    )).join(',\n');

    return `

migrations.push({
  id: ${ JSON.stringify(name) },
  actions: {
${ actionsString }
  }
});`;
  }

  ensure() {
    return readFile(this._path).catch(() => (
      writeFile(this._path, this.getFileTemplate())
    ));
  }

  destroy() {
    return remove(this._path);
  }

  getAllMigrations() {
    return require(this._path);
  }

  addMigration(name, options) {
    return writeFile(this._path, this.getMigrationTemplate(name, options), {
      flags: 'a'
    });
  }

  generateBundleEntry() {
    return this._path;
  }
}

module.exports = FileMigrationStorage;
