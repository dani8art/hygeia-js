'use strict';

class MemoryStore {

    constructor(options) {
        if (!options.data)
            throw new Error('Data is required.');
        this.data = options.data;
    }

    get() {
        return Promise.resolve(this.data);
    }

}

module.exports = { MemoryStore };