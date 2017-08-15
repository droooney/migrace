const TARGETS = {
  ES5: 0,
  ES6: 1,
  ES7: 2,
  ES8: 3,
  ESNext: 4
};

exports.getTargetMagicNumber = (target) => {
  target = target.toLowerCase();

  if (target === 'esnext') {
    return TARGETS.ESNext;
  }

  if (target === 'es8' || target === 'es2017') {
    return TARGETS.ES8;
  }

  if (target === 'es7' || target === 'es2016') {
    return TARGETS.ES7;
  }

  if (target === 'es6' || target === 'es2015') {
    return TARGETS.ES6;
  }

  return TARGETS.ES5;
};

exports.TARGETS = TARGETS;
