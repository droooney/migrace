const MetadataStorage = require('./');

class LocalStorage extends MetadataStorage {
  constructor({
    keyName = '__migrace_metadata__'
  } = {}) {
    super();

    this._keyName = keyName;
  }

  ensure() {
    return this.write('');
  }

  destroy() {
    return new Promise((resolve) => {
      localStorage.removeItem(this._keyName);

      resolve();
    });
  }

  read() {
    return new Promise((resolve) => {
      resolve(localStorage.getItem(this._keyName));
    });
  }

  write(json) {
    return new Promise((resolve) => {
      localStorage.setItem(this._keyName, json);

      resolve();
    });
  }
}

module.exports = LocalStorage;
