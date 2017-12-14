'use strict';

const { EmailReporter } = require('./email-reporter');

const TYPES = ['email']

module.exports = {
    reporterFactory: (options) => {

        if (options.type && TYPES.indexOf(options.type) === -1)
            throw new Error('This type of reporter is not implemented.');

        switch (options.type) {

            case 'email':
                return new EmailReporter(options);

            default:
                return new EmailReporter(options);

        }
    }
};