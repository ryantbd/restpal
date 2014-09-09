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

describe('RESTpal methods avilability', function () {

  var app, url;

  before(function () {
    app = express();

    app.use(bodyParser.json());

    app.get('/test', function (req, res) {
      res.status(200).send('get');
    });

    var s = app.listen(function () {
      url = 'http://localhost:' + s.address().port + '/test';
    });
  });

  describe('.header(key, value)', function () {
    it('right response header should match', function (done) {
      restpal
        .get(url)
        .header('x-powered-by', 'Express')
        .header('content-type', /text\/html/)
      .run(done);
    });

    it('wrong response header should not match', function (done) {
      restpal
        .get(url)
        .header('content-type', /text\/json/)
      .run(function (err) {
        if (err) {
          done(); 
        } else {
          done(new Error('should not match'))
        }
      });
    })
  });

  describe('.header(options)', function () {
    it('right response header should match', function (done) {
      restpal
        .get(url)
        .header({
          'x-powered-by': 'Express',
          'content-type': /text\/html/
        })
      .run(done);
    });

    it('wrong response header should not match', function (done) {
      restpal
        .get(url)
        .header({
          'x-powered-by': 'Express',
          'content-type': /text\/json/
        })
      .run(function (err) {
        if (err) {
          done();
        } else {
          done(new Error('wrong response header should not match'));
        }
      });
    });
  });

  describe('.status(statusCode)', function () {
    it('right status should pass', function (done) {
      restpal
        .get(url)
        .status(200)
      .run(done);
    });

    it('wrong status should fail', function (done) {
      restpal
        .get(url)
        .status(204)
      .run(function (err) {
        if (err) {
          done();
        } else {
          done(new Error('wrong status should fail'));
        }
      });
    });
  });

  describe('.timer(expectedTime)', function () {
    it('request should finish within 2000ms', function (done) {
      restpal
        .get(url)
        .timer(2000)
      .run(done);
    });

    it('request would not finish within 1ms', function (done) {
      restpal
        .get(url)
        .timer(1)
      .run(function (err) {
        if (err) {
          done();
        } else {
          done(new Error('how could it happen'));
        }
      });
    });
  });

  describe('.schema(options)', function () {
    // there's a lot things to do here.
    it('should pass right match', function (done) {
      restpal
        .get(url)
        .schema({
          type: 'string',
          pattern: /get/
        })
      .run(done);
    });

    it('should fail wrong match', function (done) {
      restpal
        .get(url)
        .schema({
          type: 'object'
        })
      .run(function (err) {
        if (err) {
          done();
        } else {
          done(new Error('should fail wrong match'));
        }
      });
    });
  });

  describe('.check(function (restponse) { })', function () {
    it('should contain things restpal needed', function (done) {
      restpal
        .get(url)
        .check(function (res) {
          res.headers.should.be.type('object');
          res.body.should.be.type('string');
          res.statusCode.should.be.type('number');
        })
      .run(done);
    });

    it('should throw error if check failed', function (done) {
      restpal
        .get(url)
        .check(function (res) {
          res.headers.should.be.type('string');
        })
      .run(function (err) {
        if (err) {
          done();
        } else {
          done(new Error('should throw error if check failed'));
        }
      });
    });
  });

  describe('.run(function (err) { })', function () {
    it('argument should be undefined if nothing\'s wrong', function (done) {
      restpal
        .get(url)
        .status(200)
      .run(function (err) {
        if (!err) {
          done();
        } else {
          done(new Error('argument should be undefined if nothing\'s wrong'));
        }
      });
    });

    it('argument should be an Error if something\'s wrong', function (done) {
      restpal
        .get(url)
        .status(404)
      .run(function (err) {
        if (err && err instanceof Error) {
          done();
        } else {
          done(new Error('argument should be an Error if something\'s wrong'));
        }
      });
    });
  });
});