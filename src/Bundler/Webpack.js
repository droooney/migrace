const { resolve, dirname, basename } = require('path');
const MemoryFS = require('memory-fs');
const Webpack = require('webpack');

const Bundler = require('./');

const { assign } = require('../utils');

class WebpackBundler extends Bundler {
  constructor(options = {}) {
    super();

    const {
      config = {},
      webpack = Webpack
    } = options;

    this._webpack = webpack;
    this._config = config;
  }

  generateBundle(entryPath, options) {
    return new Promise((res, reject) => {
      const outputPath = resolve(process.cwd(), options.bundlePath);
      const config = assign({}, this._config, {
        entry: entryPath,
        output: assign({}, this._config.output, {
          path: dirname(outputPath),
          filename: basename(outputPath)
        })
      });

      const webpack = this._webpack(config);
      const memoryFs = new MemoryFS();

      webpack.outputFileSystem = memoryFs;

      webpack.run((err, stats) => {
        if (err) {
          reject(err);
        } else if (stats.hasErrors()) {
          reject(stats.toJson().errors);
        } else {
          res(memoryFs.readFileSync(options.bundlePath, 'utf8'));
        }
      });
    }).then((code) => (
      code
        .trim()
        .replace(/;$/, '')
    ));
  }
}

module.exports = WebpackBundler;
