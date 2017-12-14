'use strict';

const { MemoryStore } = require('./memory-store');

const TYPES = ['memory']

module.exports = {
    storeFactory: (options) => {

        if (options.type && TYPES.indexOf(options.type) === -1)
            throw new Error('This type of store is not implemented.');

        switch (options.type) {

            case 'memory':
                return new MemoryStore(options);

            default:
                return new MemoryStore(options);

        }

    }
};