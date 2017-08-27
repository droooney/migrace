const Rollup = require('rollup');

const Bundler = require('./');

const { assign } = require('../utils');

class RollupBundler extends Bundler {
  constructor(options = {}) {
    super();

    const {
      config = {},
      rollup = Rollup
    } = options;

    this._rollup = rollup;
    this._config = config;
  }

  generateBundle(entryPath) {
    const inputOptions = assign({}, this._config, {
      input: entryPath
    });

    return this._rollup.rollup(inputOptions)
      .then((bundle) => {
        const outputOptions = assign({}, this._config, {
          format: 'iife',
          name: 'migrations'
        });

        return bundle.generate(outputOptions);
      })
      .then(({ code }) => (
        code
          .trim()
          .replace(/(?:^var migrations = |;$)/g, '')
      ));
  }
}

module.exports = RollupBundler;
