/**
 * hygeia-js
 * Copyright (c) 2018 darteaga (https://github.com/dani8art/hygeia-js)
 * GPL-3.0 Licensed
 */

'use strict';

const { EmailReporter } = require('./reporter-email');

/**
 * This define all available/implemented reporters
 */
const TYPES = ['email']

module.exports = {
    /**
     * Function factory for reporter. This function return an
     * instance of options.type repoter. By default return instance 
     * of EmailReporter.
     * @function
     * @param {any} options 
     */
    createReporter: (options) => {

        if (options.type && TYPES.indexOf(options.type) === -1)
            throw new Error('This type of reporter is not implemented.');

        switch (options.type) {

            case 'email':
                return new EmailReporter(options);

            default:
                return new EmailReporter(options);

        }
    },

    EmailReporter
};