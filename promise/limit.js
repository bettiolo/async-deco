var _limit = require('../src/limit');
var wrapper = require('../src/promise-translator');

function limit(max, getKey) {
  return _limit(wrapper, max, getKey);
}

module.exports = limit;
