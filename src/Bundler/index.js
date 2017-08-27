const { resolve } = require('path');
const { outputFile } = require('fs-extra');

class Bundler {
  __generateBundle__(entryPath, options) {
    return new Promise((res) => {
      res(this.generateBundle(resolve(process.cwd(), entryPath), options));
    }).then((code) => (
      outputFile(options.bundlePath, code)
    ));
  }

  generateBundle() {
    throw new Error('Abstract Bundler#generateBundle method called');
  }
}

module.exports = Bundler;
