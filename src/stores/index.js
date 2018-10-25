/**
 * hygeia-js
 * Copyright (c) 2018 darteaga (https://github.com/dani8art/hygeia-js)
 * GPL-3.0 Licensed
 */

'use strict';

const { MemoryStore } = require('./store-memory');

/**
 * This define all available/implemented stores
 */
const TYPES = ['memory']

module.exports = {
    /**
     * Function factory for store. This function return an
     * instance of 'options.type' store. By default return instance 
     * of MemoryStore.
     * @function
     * @param {any} options 
     */
    createStore: (options) => {

        if (options.type && TYPES.indexOf(options.type) === -1)
            throw new Error('This type of store is not implemented.');

        switch (options.type) {

            case 'memory':
                return new MemoryStore(options);

            default:
                return new MemoryStore(options);

        }

    },

    MemoryStore
};