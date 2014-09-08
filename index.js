var Restpal = require('./lib/restpal');

function restpal (uri, options) {
  return new Restpal(uri, options);
}

restpal.get = function (uri, options) {
  return restpal(uri, options).get();
};

restpal.post = function (uri, options) {
  return restpal(uri, options).post();
};

restpal.put = function (uri, options) {
  return restpal(uri, options).put();
};

restpal.delete = function (uri, options) {
  return restpal(uri, options).delete();
};  

module.exports = restpal;