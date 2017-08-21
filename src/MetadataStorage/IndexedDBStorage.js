const MetadataStorage = require('./');

class IndexedDBMetadataStorage extends MetadataStorage {
  constructor(options = {}) {
    super();

    const {
      storageName = '__migrace_metadata__'
    } = options;
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
