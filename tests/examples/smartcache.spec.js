var assert = require('chai').assert;
var Cache = require('memoize-cache');
var dedupeDecorator = require('../../callback/dedupe');
var cacheDecorator = require('../../callback/cache');
var compose = require('../../utils/compose');

describe('smartcache (callback)', function () {
  var cache, dedupe;
  var log;

  beforeEach(function () {
    log = [];
    var logger = function () {
      return function (type, obj) {
        log.push({type: type, obj: obj});
      };
    };

    var maxAge = 120;
    var cacheObj = new Cache({maxAge: maxAge});

    cache = cacheDecorator(cacheObj, logger);
    dedupe = dedupeDecorator(undefined, logger);
  });

  it('must dedupe function calls', function (done) {
    var numberRuns = 0;
    var numberCBRuns = 0;

    var f = dedupe(function (a, next) {
      numberRuns++;
      setTimeout(function () {
        next(undefined, a);
      }, 20); // latency
    });

    for (var i = 0; i < 20; i++) {
      setTimeout((function (t) {
        return function () {
          f(t, function (err, res) {
            numberCBRuns++;
            if (numberCBRuns === 20) {
              assert.equal(numberRuns, 4);
              done();
            }
          });
        };
      }(i)), i * 5);
    }

  });

  it('must dedupe/cache function calls', function (done) {
    var numberRuns = 0;
    var numberCBRuns = 0;
    var smartcache = compose(dedupe, cache);

    var f = smartcache(function (a, next) {
      numberRuns++;
      setTimeout(function () {
        next(undefined, a);
      }, 20); // latency
    });

    for (var i = 0; i < 20; i++) {
      setTimeout((function (t) {
        return function () {
          f(t, function (err, res) {
            numberCBRuns++;
            if (numberCBRuns === 20) {
              assert.equal(numberRuns, 1);
              done();
            }
          });
        };
      }(i)), i * 5);
    }
  });
});