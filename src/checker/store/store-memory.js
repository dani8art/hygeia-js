'use strict';
/**
 * @class MemoryStore
 */
class MemoryStore {

    /**
     * Creates an instance of MemoryStore.
     * @param {any} options 
     * @memberof MemoryStore
     */
    constructor(options) {
        if (!options.data)
            throw new Error('Data is required.');
        this.data = options.data;
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

module.exports = { MemoryStore };