'use strict';

/**
 * 
 * @class Measure
 */
class Measure {
    /**
     * Creates an instance of Measure.
     * @param {string} service Name of the service
     * @memberof Measure
     */
    constructor(service) {
        this.service = service;
        this.startTs = Measure.now();
    }

    /**
     * Finalize the measure and mark the time.
     * @param {number} result HTTP status code of the request. 
     * @memberof Measure
     */
    end(result) {
        this.endTs = Measure.now();
        this.health = result;
        return this;
    }

    /**
     * Helper for calculate the time at now.
     * @returns 
     * @memberof Measure
     */
    static now() {
        return (new Date);
    }

    /**
     * Calculate duration and parse dates to ISO string.
     * @returns {Measure} this
     * @memberof Measure
     */
    value() {
        if (!this.health) throw new Error('Can not call value() before end()');

        this.duration = this.endTs - this.startTs;
        this.startTs = this.startTs.toISOString();
        this.endTs = this.endTs.toISOString();
        return this;
    }

}

module.exports = { Measure };