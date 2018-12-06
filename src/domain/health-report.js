/**
 * hygeia-js
 * Copyright (c) 2018 darteaga (https://github.com/dani8art/hygeia-js)
 * GPL-3.0 Licensed
 */

'use strict';
const Measure = require('./measure');

/**
 * @class HealthReport
 */
class HealthReport {

    /**
     * Creates an instance of HealthReport.
     * @constructor
     */
    constructor() {
        this.pkg = require('../../package.json');
        this.version = this.pkg.version;
        this.environment = process.env.NODE_ENV || 'dev';
        this.measures = [];
    }

    /**
     * Start reporting time and measures.
     * @returns {this}
     * @memberof HealthReport
     */
    start() {
        if (!this.measure) this.measure = new Measure('health-report');
        return this;
    }

    /**
     * Add Service measures.
     * @param {Measure} measure Measure that will be added to the report.
     * @returns {this}
     * @memberof HealthReport
     */
    addMeasure(measure) {
        if (!this.measure) throw new Error('Can not add measures before starting a report.');
        this.measures.push(measure);
        return this;
    }

    /**
     * Get the health/result of the entrie report.
     * @returns {this}
     * @memberof HealthReport
     */
    getHealth() {
        let health = 200;
        this.measures.forEach(measure => {
            if (measure.health > health || typeof measure.health === 'string') health = measure.health;
        });
        return health;
    }

    /**
     * Check if there are any service unhealthy
     * @returns {boolean} Boolean that indicate if this report has all services healthy. 
     * @memberof HealthReport
     */
    isHealthy() {
        if (!this.health) throw new Error('HealthReport must be finished before check isHealthy');
        return this.getHealth() < 300;
    }

    /**
     * End the health report and recopile information.
     * @returns {this}
     * @memberof HealthReport
     */
    end() {
        if (!this.measure)
            throw new Error('Can not end an HealthReport before start');

        this.measure.end(this.getHealth()).value();
        this.date = this.measure.startTs;
        this.health = this.measure.health;
        this.duration = this.measure.duration;
        delete this.measure;
        delete this.pkg;
        return this;
    }

}

module.exports = HealthReport;