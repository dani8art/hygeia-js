/**
 * hygeia-js
 * Copyright (c) 2018 darteaga (https://github.com/dani8art/hygeia-js)
 * GPL-3.0 Licensed
 */

'use strict';

/**
 * @class Service
 */
class Service {

    /**
     * Creates an instance of Service.
     * @constructor
     * @param {string} service.name The name of the service.
     * @param {url} service.health Service endpoint that will be checked.
     * @param {string} service.method HTTP method that will be used
     * @param {string} service.timeout Request timeout.
     */
    constructor(service) {
        if (!service.name) throw new Error('name property is required on type Service.');
        this.name = service.name;

        if (!service.health) throw new Error('health property is required on type Service.');
        this.health = service.health

        this.method = service.method || 'GET';

        if (service.timeout && typeof service.timeout !== "number") throw new Error('timeout property must be a number.');
        this.timeout = service.timeout || Service.DEFAULT_TIMEOUT;
    }

    /**
     * Return the JSON schema of Service Object
     * @static
     * @returns {ServiceSchema} JSON Schema of Service Object
     * @memberof Service
     */
    static getJSONSchema() {
        return {
            '$schema': 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            title: 'Pet',
            properties: {
                service: { type: 'string' },
                health: { type: 'string' }, // Add URL match
                method: { type: 'string' },
                timeout: { type: 'number' }
            },
            required: ['service', 'health']
        }
    }

}

Service.DEFAULT_TIMEOUT = 10 * 1000;

module.exports = Service;