var _fallbackValue = require('../src/fallback-value');
var wrapper = require('../src/promise-translator');

function fallbackValue(value, error, logger) {
  return _fallbackValue(wrapper, value, error, logger);
}

module.exports = fallbackValue;
