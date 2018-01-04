'use strict';

const https = require('https').request;
const http = require('http').request;
const URL = require('url');
const { Measure } = require('./measure');
const { Service } = require('./service');
const { createStore } = require('./store');
const { createReporter } = require('./reporter');
/**
 * @class Checker
 */
class Checker {
    /**
     * Creates an instance of Checker.
     * @param {any} options 
     * @memberof Checker
     */
    constructor(options) {
        if (!options.store) throw new Error('Store options are required.');
        if (!options.reporter) throw new Error('Reporter options are required.');

        this.options = options;
        this.store = createStore(options.store);
        this.reporter = createReporter(options.reporter);
    }

    /**
     * Set the store of the checker
     * @param {Store} store 
     * @memberof Checker
     */
    useStore(store) {
        console.log('Set store.');
        this.store = store;
    }

    /**
     * Execute check of status of the services in the store.
     * @memberof Checker
     */
    check() {
        let promises = [], measure = new Measure('statuschecker'), values = [];
        return new Promise((resolve, reject) => {
            this.store.get()
                .then(services => {

                    console.log('Start checking for: %s', services.map(e => e.name));

                    // Make promises checking if data are compliance with class Service.
                    services.map(ser => new Service(ser)).forEach(element => {
                        promises.push(Checker.request(element));
                    });

                    return Promise.all(promises);

                })
                .then(res => {

                    values = res.map(e => e.value());

                    values.push(measure.end(200).value());

                    console.log('End checking, Results: %s', JSON.stringify(values, null, 2));
                })
                .then(() => {

                    console.log('Reporter policy = ' + this.reporter.policy);
                    let isHealthy = this.isHealthy(values);
                    console.log('isHealthy = ' + isHealthy);

                    if ((this.reporter.policy === 'error' && !isHealthy) || this.reporter.policy === 'always') {
                        console.log('Send report by ' + this.reporter.name);
                        return this.reporter.send(values).then(resolve);
                    } else {
                        console.log('Not Send report');
                        return Promise.resolve();
                    }

                })
                .catch(err => {

                    console.error(err);
                    console.log('Send status checking by reporter.');
                    return this.reporter.send(values).then(() => reject(err)).catch(reject);

                });
        });
    }

    /**
     * Make an HTTP/S request for checking the state.
     * @static
     * @param {Service} service Service to be checked.
     * @returns 
     * @memberof Checker
     */
    static request(service) {
        console.log('Send request for checking service=%s', service.name);

        return new Promise((resolve, reject) => {

            let measure = new Measure(service.name), requester = http;

            if (service.health.indexOf('https://') !== -1)
                requester = https;

            let url = URL.parse(service.health);
            let opt = {
                protocol: url.protocol,
                hostname: url.hostname,
                port: url.port,
                path: (url.pathname || '') + (url.search || ''),
                method: service.method,
                timeout: service.timeout
            };

            let req = requester(opt, (res) => {
                measure.end(res.statusCode);
                res.setEncoding('utf8');
                res.on('data', (chunk) => { });
                res.on('end', () => resolve(measure));
            }, reject);

            req.on('socket', socket => {
                try {
                    socket.setTimeout(service.timeout);
                } catch (e) { return reject(e); }

                // abort if timeout
                socket.on('timeout', () => req.abort());
                socket.on('error', reject);
            });

            req.on('error', err => {
                measure.end(err.code);
                resolve(measure);
            });
            req.end();

        });
    }

    /**
     * Check if a health report have any servive unhealthy.
     * @param {any} health 
     * @returns {Boolean} isHealthy
     * @memberof Checker
     */
    isHealthy(health) {
        let isHealthy = true;
        health.forEach(s => isHealthy = isHealthy && s.result < 300);
        return isHealthy;
    }
}



module.exports = { Checker };
