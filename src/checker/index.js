'use strict';

const https = require('https').request;
const http = require('http').request;
const URL = require('url');
const { Measure } = require('./measure');
const { storeFactory } = require('./store');
const { createReporter } = require('./reporter');
/**
 * @class Checker
 */
class Checker {

    constructor(options) {
        this.options = options;
        this.store = storeFactory(options.store);
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
                    services.forEach(element => {
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

                    console.log('Send status checking by reporter.');
                    return this.reporter.send(values).then(resolve);

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
        const REQ_DEFAULT_TIMEOUT = 10 * 1000;
        console.log('Send request for checking service=%s', service.name);

        // set default timeout for services
        service.timeout = service.timeout || REQ_DEFAULT_TIMEOUT;

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
                socket.setTimeout(service.timeout);
                // abort if timeout
                socket.on('timeout', () => req.abort());
            });

            req.on('error', err => {
                measure.end(err.code);
                resolve(measure);
            });
            req.end();

        });
    }
}



module.exports = { Checker };
