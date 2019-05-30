'use strict';
const Service = require('../domain/service');

/**
 * @class MemoryStore
 */
class MemoryStore {

    /**
     * Creates an instance of MemoryStore.
     * @param {any} options 
     * @memberof MemoryStore
     * @example
     * ```js
     * const MemoryStore = require('hygeia-js/stores/store-memory');
     * 
     * const store = new MemoryStore({
     *  data: [ { name: 'google', health: 'http://www.google.es' } ],
     * });
     * ```
     */
    constructor(options) {
        if (!options.data) { throw new Error('Data is required.'); }

        // add services data from memory checking if they are compliance with class Service.
        this.data = options.data.map(ser => new Service(ser));
    }

    /**
     * Return the services to be checked
     * @returns {Promise<any>}
     * @memberof MemoryStore
     */
    get() {
        return Promise.resolve(this.data);
    }

}

module.exports = MemoryStore;