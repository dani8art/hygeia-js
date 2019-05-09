'use strict';
const Checker = require('../../src');
const MemoryStore = require('../../src/stores/store-memory');
const EmailReporter = require('../../src/reporters/reporter-email');

const config = require('./config');

exports.handler = (event, context, callback) => {
    const envConfig = config[process.env.NODE_ENV || 'dev'];

    const store = new MemoryStore(envConfig.store);
    const reporter = new EmailReporter(envConfig.reporter);

    const checker = new Checker({ store, reporter });

    checker.check()
        .then(() => callback(null, 'Status checked for all the services.'))
        .catch((err => callback(err)));
}

