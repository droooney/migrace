class MetadataStorage {
  __destroy__() {
    return this.ensure().then(() => this.destroy());
  }

  __read__() {
    return this.ensure().then(() => this.read());
  }

  __write__(json) {
    return this.ensure().then(() => this.write(json));
  }

  ensure() {
    return Promise.reject(new Error('Abstract MetadataStorage#ensure method called'));
  }

  destroy() {
    return Promise.reject(new Error('Abstract MetadataStorage#destroy method called'));
  }

  read() {
    return Promise.reject(new Error('Abstract MetadataStorage#read method called'));
  }

  write() {
    return Promise.reject(new Error('Abstract MetadataStorage#write method called'));
  }
}

module.exports = MetadataStorage;
