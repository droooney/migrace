const { resolve } = require('path');
const { ensureFile, readFile, writeFile, remove } = require('fs-extra');

const MetadataStorage = require('./');

class FileStorage extends MetadataStorage {
  constructor({
    path = resolve('./migrace-metadata.json')
  } = {}) {
    super();

    this._path = path;
  }

  ensure() {
    return ensureFile(this._path);
  }

  destroy() {
    return remove(this._path);
  }

  read() {
    return readFile(this._path, 'utf8');
  }

  write(json) {
    return writeFile(this._path, json);
  }
}

module.exports = FileStorage;
