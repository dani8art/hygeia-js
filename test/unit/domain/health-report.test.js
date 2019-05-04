'use strict';
const HealthReport = require('../../../src/domain/health-report');
const pkg = require('../../../package.json');

describe('HealthReport', () => {

    test('Create new HealthReporter', () => {
        let hreport = new HealthReport();

        expect(hreport.version).toBe(pkg.version);
        expect(hreport.environment).toBe('test');
        expect(hreport.measures).not.toBeNull;
    });

    test('Create new HealthReporter with env in the process', () => {
        delete process.env.NODE_ENV;
        let hreport = new HealthReport();

        expect(hreport.version).toBe(pkg.version);
        expect(hreport.environment).toBe('dev');
        expect(hreport.measures).not.toBeNull;

        process.env.NODE_ENV = 'test';
    });

    test('Start HealthReporter', () => {
        let hreport = new HealthReport().start();

        expect(hreport.measure).not.toBeNull;
    });

    test('Call Start HealthReporter twice', () => {
        let hreport = new HealthReport().start().start();

        expect(hreport.measure).not.toBeNull;
    });

    test('Add measure to an HealthReporter', () => {
        let measure = {
            service: "google",
            startTs: "2018-01-08T18:57:03.049Z",
            endTs: "2018-01-08T18:57:03.921Z",
            health: 200,
            duration: 872
        }
        let hreport = new HealthReport()
            .start()
            .addMeasure(measure);

        expect(hreport.measures).toHaveLength(1);
    });

    test('Add measure before start throw error', () => {
        let measure = {
            service: "google",
            startTs: "2018-01-08T18:57:03.049Z",
            endTs: "2018-01-08T18:57:03.921Z",
            health: 200,
            duration: 872
        }
        expect(() => {
            let hreport = new HealthReport()
                .addMeasure(measure);
        }).toThrow('Can not add measures before starting a report.');
    });

    test('getHealth 200 of an HealthReport', () => {
        let measure = {
            service: "google",
            startTs: "2018-01-08T18:57:03.049Z",
            endTs: "2018-01-08T18:57:03.921Z",
            health: 200,
            duration: 872
        }
        let hreport = new HealthReport()
            .start()
            .addMeasure(measure);

        expect(hreport.getHealth()).toBe(200);
    });

    test('getHealth !=200 of an HealthReport', () => {
        let measure = {
            service: "google",
            startTs: "2018-01-08T18:57:03.049Z",
            endTs: "2018-01-08T18:57:03.921Z",
            health: 500,
            duration: 872
        }
        let hreport = new HealthReport()
            .start()
            .addMeasure(measure);

        expect(hreport.getHealth()).not.toBe(200);
    });

    test('isHealthy TRUE', () => {
        let measure = {
            service: "google",
            startTs: "2018-01-08T18:57:03.049Z",
            endTs: "2018-01-08T18:57:03.921Z",
            health: 200,
            duration: 872
        }
        let hreport = new HealthReport()
            .start()
            .addMeasure(measure).end();

        expect(hreport.isHealthy()).toBe(true);
    });

    test('isHealthy FALSE', () => {
        let measure = {
            service: "google",
            startTs: "2018-01-08T18:57:03.049Z",
            endTs: "2018-01-08T18:57:03.921Z",
            health: 500,
            duration: 872
        }
        let hreport = new HealthReport()
            .start()
            .addMeasure(measure).end();

        expect(hreport.isHealthy()).toBe(false);
    });

    // ishealthy with error
    test('isHealthy with error', () => {
        let measure = {
            service: "google",
            startTs: "2018-01-08T18:57:03.049Z",
            endTs: "2018-01-08T18:57:03.921Z",
            health: 200,
            duration: 872
        }
        let hreport = new HealthReport()
            .start()
            .addMeasure(measure);

        expect(() => { hreport.isHealthy() }).toThrow('HealthReport must be finished before check isHealthy');
    });

    test('end() an HealthReport', () => {
        let measure = {
            service: "google",
            startTs: "2018-01-08T18:57:03.049Z",
            endTs: "2018-01-08T18:57:03.921Z",
            health: 200,
            duration: 872
        }
        let hreport = new HealthReport()
            .start()
            .addMeasure(measure).end();

        expect(hreport.date).not.toBeNull;
        expect(hreport.health).not.toBeNull;
        expect(hreport.duration).not.toBeNull;
    });

    test('end() an HealthReport before start', () => {

        expect(() => {
            let hreport = new HealthReport().end();
        }).toThrow('Can not end an HealthReport before start');

    });
});