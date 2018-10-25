'use strict';
const { Checker } = require('../../src');
const config = require('./config');

exports.handler = (event, context, callback) => {

    const checker = new Checker(config[process.env.NODE_ENV || 'dev']);

    checker.check()
        .then(() => callback(null, 'Status checked for all the services.'))
        .then((err => callback(err)));

}

