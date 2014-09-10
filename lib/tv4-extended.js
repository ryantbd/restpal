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

tv4.addFormat('numeric', function (data, schema) {
  var res;

  if (data !== '' && data !== undefined && data !== null && !isNaN(Number(data))) {
    res = null;
  } else {
    res = data + ' seems not a number or a number-like string';
  }

  return res;
});

module.exports = tv4;