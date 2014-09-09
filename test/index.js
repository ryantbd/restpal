var restpal = require('../');
var express = require('express');
var bodyParser = require('body-parser');
var should = require('should');

describe('REST methods', function () {

  var app, url;

  before(function () {
    app = express();

    app.use(bodyParser.json());

    app.route('/test')
    .get(function (req, res, next) {
      res.status(200).send('get');
    })
    .post(function (req, res, next) {
      res.status(200).send(req.body);
    })
    .put(function (req, res, next) {
      res.status(202).send('put');
    })
    .delete(function (req, res, next) {
      res.status(204).end();
    });

    var s = app.listen(function () {
      url = 'http://localhost:' + s.address().port + '/test';
    });
  });

  it('GET', function (done) {
    restpal
      .get(url)
      .status(200)
    .run(done);
  });

  it('POST', function (done) {
    restpal
      .post(url, {
        json: { md: 'testing'}
      })
      .status(200)
      .schema({
        type: 'object',
        properties: {
          md: {
            type: 'string',
            pattern: /^testing$/
          }
        }
      })
    .run(done);
  });

  it('PUT', function (done) {
    restpal
      .put(url)
      .status(202)
      .schema({
        pattern: /put/
      })
    .run(done);
  });

  it('DELETE', function (done) {
    restpal
      .delete(url)
      .status(204)
    .run(done);
  });
});