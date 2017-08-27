const { VALIDATION_ERROR } = require('./errorTypes');

class ValidationError extends Error {
  constructor(message) {
    super(message);

    this.code = VALIDATION_ERROR;
    this.__proto__ = ValidationError.prototype; // eslint-disable-line no-proto
  }
}

module.exports = ValidationError;
