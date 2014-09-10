var tv4 = require('tv4');

tv4.defineKeyword('equals', function (data, value, schema) {
  var res;
  
  if (data === value) {
    res = null;
  } else {
    res = data + ' should be euqal to ' + value;
  }

  return res;

});

module.exports = tv4;