const MetadataStorage = require('./');

class IndexedDBMetadataStorage extends MetadataStorage {
  constructor({
    storageName = '__migrace_metadata__'
  } = {}) {
    super();
  }

  _transaction() {

  }

  ensure() {

  }

  destroy() {

  }

  read() {

  }

  write(json) {

  }
}

module.exports = IndexedDBMetadataStorage;
