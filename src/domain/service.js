/**
 * hygeia-js
 * Copyright (c) 2018 darteaga (https://github.com/dani8art/hygeia-js)
 * GPL-3.0 Licensed
 */

'use strict';

/**
 * This class represent a service for checking his health
 * @class Service
 */
class Service {

    /**
     * Creates an instance of Service.
     * @param {any} service Properties of service
     * @memberof Service
     */
    constructor(service) {
        // Property name
        if (!service.name) throw new Error('name property is required on type Service.');
        this.name = service.name;

        // Property health
        if (!service.health) throw new Error('health property is required on type Service.');
        this.health = service.health

        // Property method
        this.method = service.method || 'GET';

        // Property timeout
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