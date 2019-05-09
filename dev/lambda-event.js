'use strict';

var hygeiaLambda = require('../examples/lambda/lambda-handler');

hygeiaLambda.handler(null, null, err => {
  if (err) { console.log(err); }
});
