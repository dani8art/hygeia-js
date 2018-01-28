'use strict';

const https = require('https').request;
const http = require('http').request;
const URL = require('url');
const { HealthReport, Measure, Service } = require('./domain');
const { createStore } = require('./stores');
const { createReporter } = require('./reporters');
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
                    let isHealthy = hreport.isHealthy();
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
