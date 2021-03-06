var TimeoutError = require('../errors/timeout-error');
var defaultLogger = require('../utils/default-logger');

function timeout(wrapper, ms) {

  return wrapper(function (func) {
    return function () {
      var context = this;
      var args = Array.prototype.slice.call(arguments, 0);
      var logger = defaultLogger.apply(context);
      var cb = args[args.length - 1];

      var timedout = false;
      var timeout = setTimeout(function () {
        var err = new TimeoutError('TimeoutError: Service timed out after ' + ms.toString() + ' ms');
        timedout = true;
        logger('timeout', {
          ms: ms
        });
        cb(err);
      }, ms);

      // new callback
      args[args.length - 1] = function () {
        var cb_context = this;
        var cb_args = Array.prototype.slice.call(arguments, 0);

        if (timedout) {
          return; // abort because has been already called
        }
        clearTimeout(timeout); // abort time out
        cb.apply(cb_context, cb_args);
      };

      func.apply(context, args);
    };
  });
}

module.exports = timeout;
