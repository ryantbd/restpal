var Restpal = require('./lib/restpal');

function restpal (uri, options) {
  return new Restpal(uri, options);
}

restpal.get = function (uri, options) {
  options = options || {};
  options.method = 'GET';
  return restpal(uri, options);
};

restpal.post = function (uri, options) {
  options = options || {};
  options.method = 'POST';
  return restpal(uri, options);
};

restpal.put = function (uri, options) {
  options = options || {};
  options.method = 'PUT';
  return restpal(uri, options);
};

restpal.delete = function (uri, options) {
  options = options || {};
  options.method = 'DELETE';
  return restpal(uri, options);
};  

module.exports = restpal;