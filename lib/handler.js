var request = require('request');
var tv4 = require('tv4');

Error.stackTraceLimit = 0;

function Handler (expects, callbacks) {
  this.errors = [];
  this.expects = expects;
  this.callbacks = callbacks;
  this.timer = {};
}

Handler.prototype.checkStatus = function (resCode) {
  var expected = this.expects.status;
  if (expected && expected !== resCode) {
    this.errors.push({
      name: 'status',
      msg: 'expected [' + expected + '], returned [' + resCode + ']'
    });
  }
};

Handler.prototype.checkHeader = function (resHeader) {
  var expectedHeader = this.expects.header;

  if (!expectedHeader) {
    return;
  }

  for (var key in expectedHeader) {
    if (key in resHeader) {
      var expected = expectedHeader[key];
      var returned = resHeader[key];
      var pass = false;

      pass = expected instanceof RegExp ? 
              expected.test(returned) : (expected.toString() === returned);
      
      if (!pass) {
        this.errors.push({
          name: 'header',
          msg: key + ': ' + returned + ', does not match ' + expected
        });
      }
    } else {
      this.errors.push({
        name: 'header',
        msg: key + ' is not in response header'
      });
    }
  }
};

Handler.prototype.checkTimer = function () {
  var start = this.timer.start;
  var end = this.timer.end;
  var expected = this.expects.timer;
  var spent = end - start;
  if (expected && spent > expected) {
    this.errors.push({
      name: 'timer',
      msg: 'Request finished in [' + spent + 'ms], longer than expected [' + expected + 'ms].'
    });
  }
};

Handler.prototype.checkSchema = function (body) {
  var schema = this.expects.schema;
  var self = this;
  var res, prop, parsed, parseErr, path;

  if (!schema) {
    return;
  }

  try {
    parsed = JSON.parse(body);
  } catch (e) {
    parsed = body;
  }

  if (schema) {
    res = tv4.validateMultiple(parsed, schema);
    res.errors.forEach(function (err) {
      path = err.dataPath ? err.dataPath : '/';
      self.errors.push({
        name: 'schema',
        msg: path + ': ' + err.message
      });
    });
  }
};

Handler.prototype.handleCallbacks = function (res) {
  if (this.callbacks && typeof this.callbacks.pal === 'function') {
    try {
      this.callbacks.pal(res); 
    } catch (e) {
      this.errors.push({
        name: 'pal',
        msg: 'callback error: ' + e.toString()
      });
    }
  }
};

Handler.prototype.cb = function (err, res) {
  this.timer.end = new Date();

  if (err) {
    this.errors.push({
      name: 'request',
      msg: err.toString()
    });
  } else {
    this.checkStatus(res.statusCode);
    this.checkHeader(res.headers);
    this.checkTimer();
    this.checkSchema(res.body);
    this.handleCallbacks(res); 
  }
  
  this.end();
};

Handler.prototype.start = function (uri, options) {

  var self = this;

  this.timer.start = new Date();

  request(uri, options, function (err, res) {
    self.cb(err, res);
  });

};

Handler.prototype.end = function () {

  var done = this.callbacks.run;

  if (this.errors.length > 0) {
    var messages = [];
    var exception;

    this.errors.forEach(function (e) {
      messages.push('[' + e.name + '] ' + e.msg);
    });

    exception = new Error('\n' + messages.join('\n') + '\n');

    if (typeof done === 'function') {
      done( exception );
    } else {
      throw exception;
    }
  } else {
    if (typeof done === 'function') {
      done(); 
    }
  }
};

module.exports = Handler;