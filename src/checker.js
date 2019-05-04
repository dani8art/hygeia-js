'use strict';

const https = require('https').request;
const http = require('http').request;
const URL = require('url');

const HealthReport = require('./domain/health-report');
const Service = require('./domain/service');
const Measure = require('./domain/measure');

/**
 * @class Checker
 */
class Checker {
    /**
     * Creates an instance of Checker.
     * @constructor
     * @param {Store} options.store Store where services will be gotten. 
     * @param {Reporter[]} options.reporters Reporters where HealtReport will be sent. 
     * @example
     * ```js
     * const { Checker } = require('hygeia-js');
     * const { MemoryStore } = require('hygeia-js/stores/store-memory');
     * const { EmailReporter } = require('hygeia-js/reporters/reporter-email');
     * 
     * const myChecker = new Checker({ 
     *      store: new MemoryStore(data),   
     *      reporters: [ new EmailReporter(options) ] 
     * });
     * 
     * myChecker.check().then(done).catch(errorHandler);
     * ```
     */
    constructor(options) {
        if (!options.store) throw new Error('A store is required.');
        if (!options.reporter) throw new Error('At least 1 reporter is required.');

        this.options = options;
        this.store = options.store;
        this.reporter = options.reporter;
    }

    /**
     * Set the store of the checker
     * @param {Store} store  Store where services will be gotten. 
     * @memberof Checker
     * @returns {this}
     * @example
     * ```js
     * myChecker.useStore(new FileStore('./path/to/file'))
     * ``` 
     */
    useStore(store) {
        console.log('Set store.');
        this.store = store;
        return this;
    }

    /**
     * It will check the status of every services in the `Store`, generating
     * a `HealthReport`
     * @memberof Checker
     * @returns {Promise<HealthReport>}
     * @example
     * ```js
     * myChecker.check().then(healthReport => console.log(healthReport));
     * ``` 
     */
    check() {
        let promises = [], hreport = new HealthReport().start();
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
                    // Add measures to the report.
                    res.forEach(e => hreport.addMeasure(e.value()));
                    return hreport.end();
                })
                .then((hreport) => {
                    console.log('End checking, Results: %s', JSON.stringify(hreport, null, 2));

                    console.log('Reporter policy = ' + this.reporter.policy);
                    const isHealthy = hreport.isHealthy();
                    console.log('isHealthy = ' + isHealthy);

                    if ((this.reporter.policy === 'error' && !isHealthy) || this.reporter.policy === 'always') {
                        console.log('Send report by ' + this.reporter.name);
                        return this.reporter.send(hreport).then(resolve);
                    } else {
                        console.log('Not Send report');
                        return Promise.resolve();
                    }
                })
                .catch(err => {
                    console.error(err);
                    console.log('Send status checking by reporter.');
                    return this.reporter.send(hreport).then(() => reject(err)).catch(reject);
                });
        });
    }

    /**
     * Make an HTTP/S request for checking the status of `Service`.
     * @static
     * @param {Service} service Service that will be checked.
     * @returns {Promise<Measure>}
     * @memberof Checker
     * @example
     * ```js
     * const service = {
     *   name: 'google',
     *   health: 'https://www.google.es',
     *   method: 'GET'
     * };
     * 
     * Checker.request(service).then(measure => console.log(measure));
     * ``` 
     */
    static request(service) {
        console.log('Send request for checking service=%s', service.name);

        return new Promise((resolve, reject) => {

            const measure = new Measure(service.name);
            let requester = http;

            if (service.health.indexOf('https://') !== -1) { requester = https; }

            const url = URL.parse(service.health);
            const opt = {
                protocol: url.protocol,
                hostname: url.hostname,
                port: url.port,
                path: (url.pathname || '') + (url.search || ''),
                method: service.method,
                timeout: service.timeout
            };

            const req = requester(opt, (res) => {
                console.log('End request for service=%s', service.name);
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

}

module.exports = Checker;
