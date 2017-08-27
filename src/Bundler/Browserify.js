const Browserify = require('browserify');

const Bundler = require('./');

const { assign } = require('../utils');

class BrowserifyBundler extends Bundler {
  constructor(options = {}) {
    super();

    const {
      config = {},
      browserify = Browserify
    } = options;

    this._browserify = browserify;
    this._config = config;
  }

  generateBundle(entryPath) {
    return new Promise((resolve, reject) => {
      const config = assign({}, this._config);
      const browserify = this._browserify(entryPath, config);

      browserify.bundle((err, code) => {
        if (err) {
          reject(err);
        } else {
          resolve(code);
        }
      });
    }).then((code) => (
      `${
        code
          .toString('utf8')
          .trim()
          .replace(/;$/, '')
      }(1)`
    ));
  }
}

module.exports = BrowserifyBundler;
