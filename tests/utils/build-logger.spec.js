var assert = require('chai').assert;
var buildLogger = require('../../utils/build-logger');

describe('buildLogger', function () {
  var originalOybj;
  var newObj;

  beforeEach(function () {
    originalObj = {test1: 1, test2: 2};
  });

  it('must be obj', function () {
    newObj = buildLogger(originalObj, 'name', 'id', function (name, id, ts, event, payload) {
    });
    assert.instanceOf(newObj, Object);
  });

  it('must work with undefined obj', function () {
    newObj = buildLogger(originalObj, 'name', 'id', function (name, id, ts, event, payload) {
    });
    assert(newObj);
    assert.instanceOf(newObj.__log, Function);
  });

  it('must be prototype', function () {
    newObj = buildLogger(originalObj, 'name', 'id', function (name, id, ts, event, payload) {
    });
    assert.isPrototypeOf(newObj, originalObj);
  });

  it('must have properties', function () {
    newObj = buildLogger(originalObj, 'name', 'id', function (name, id, ts, event, payload) {
    });
    assert.equal(newObj.test1, originalObj.test1);
    assert.equal(newObj.test2, originalObj.test2);
  });

  it('must have same enumerable members', function () {
    newObj = buildLogger(originalObj, 'name', 'id', function (name, id, ts, event, payload) {
    });
    assert.deepEqual(Object.keys(newObj), []);
  });

  it('must log', function (done) {
    newObj = buildLogger(originalObj, 'name', 'id', function (name, id, ts, event, payload) {
      assert.equal(name, 'name');
      assert.equal(event, 'event');
      assert.equal(payload, 'payload');
      assert.equal(id, 'id');
      assert.typeOf(ts, 'number');
      done();
    });
    newObj.__log('event', 'payload');
  });

});
