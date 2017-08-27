const ValidationError = require('./ValidationError');

const { hasOwnProperty } = {};
const { isArray } = Array;
const isObject = (value) => (
  value && typeof value === 'object'
);

exports.assign = (target, ...objects) => {
  for (let i = 0, length = objects.length; i < length; i++) {
    const object = objects[i];

    for (const key in object) {
      if (hasOwnProperty.call(object, key)) {
        target[key] = object[key];
      }
    }
  }

  return target;
};

const assert = exports.assert = (condition, message, ErrorClass = Error) => {
  if (!condition) {
    throw new ErrorClass(message);
  }
};

exports.validateMigrations = (migrations, options) => {
  assert(
    isArray(migrations),
    'Migrations must be an array of migrations',
    ValidationError
  );

  migrations.forEach((migration, index) => {
    assert(
      isObject(migrations),
      `Migration at index ${ index } is not an object`,
      ValidationError
    );

    const { id } = migration;

    assert(
      typeof id === 'string',
      `Migration at index ${ index } does not have string "id" property`,
      ValidationError
    );

    const idJson = JSON.stringify(id);

    assert(
      typeof migration.actions.up === 'function',
      `Migration with id ${ idJson } does not have "up()" method`,
      ValidationError
    );

    assert(
      typeof migration.actions.down === 'function',
      `Migration with id ${ idJson } does not have "down()" method`,
      ValidationError
    );

    if (options.force) {
      assert(
        typeof migration.actions.wasExecuted === 'function',
        `Migration with id ${ idJson } does not have "wasExecuted()" method`,
        ValidationError
      );
    }
  });
};
