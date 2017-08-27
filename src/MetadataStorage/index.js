class MetadataStorage {
  __ensure__(options) {
    return new Promise((resolve) => {
      resolve(this.ensure(options));
    });
  }

  __destroy__(options) {
    return this.__ensure__(options).then(() => this.destroy(options));
  }

  __read__(options) {
    return this.__ensure__(options).then(() => this.read(options));
  }

  __write__(data, options) {
    return this.__ensure__(options).then(() => this.write(data, options));
  }

  ensure() {
    throw new Error('Abstract MetadataStorage#ensure method called');
  }

  destroy() {
    throw new Error('Abstract MetadataStorage#destroy method called');
  }

  read() {
    throw new Error('Abstract MetadataStorage#read method called');
  }

  write() {
    throw new Error('Abstract MetadataStorage#write method called');
  }
}

module.exports = MetadataStorage;
