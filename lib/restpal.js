var Handler = require('./handler');

function Restpal (uri, options) {
  this.expects = {};
  this.callbacks = {};
  this.uri = uri;
  this.options = options || {};
}

Restpal.prototype.get = function () {
  this.options.method = 'GET';
  return this;
};

Restpal.prototype.post = function () {
  this.options.method = 'POST';
  return this;
};

Restpal.prototype.put = function () {
  this.options.method = 'PUT';
  return this;
};

Restpal.prototype.delete = function () {
  this.options.method = 'DELETE';
  return this;
};

Restpal.prototype.header = function (key, value) {
  this.expects.header = this.expects.header || {};

  if (typeof key === 'object') {
    for (var k in key) {
      this.expects.header[k.toString().toLowerCase()] = key[k];
    }
  } else {
    this.expects.header[key.toString().toLowerCase()] = value;
  }

  return this;
};

Restpal.prototype.status = function (code) {
  this.expects.status = code;
  return this;
};

Restpal.prototype.timer = function (expected) {
  this.expects.timer = expected;
  return this;
};

Restpal.prototype.schema = function (schema) {
  this.expects.schema = schema;
  return this;
};

Restpal.prototype.check = function (cb) {
  this.callbacks.check = cb;
  return this;
};

Restpal.prototype.run = function (cb) {
  this.callbacks.run = cb;
  this.handler = new Handler(this.expects, this.callbacks);
  this.handler.start(this.uri, this.options);
  
  return this;
};

module.exports = Restpal;