## RESTpal

A small library for testing REST APIs, built with Node.js

### Usage

```js
var restpal = require('./index.js');

restpal
  .get('http://your.api/to-test')
  .status(200)
  .header('content-type', /json/)
  .timer(2000)
  .schema({
    required: ['status', 'msg'],
    properties: {
      status: {
        type: 'number'
      }
    }
  })
.run();
```

### License:

The MIT License (MIT)


