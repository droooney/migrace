const { resolve } = require('path');
const { ensureFile, readFile, writeFile, remove } = require('fs-extra');

const MetadataStorage = require('./');

class FileMetadataStorage extends MetadataStorage {
  constructor(options = {}) {
    super();

    const {
      path = resolve('./migrace-metadata.json')
    } = options;

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

  write(data) {
    return writeFile(this._path, data);
  }
}

module.exports = FileMetadataStorage;
