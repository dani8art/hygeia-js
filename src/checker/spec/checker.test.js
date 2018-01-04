'use strict';
const { Checker } = require('../');
const { Measure } = require('../measure');

describe('Checker', () => {
    test('Create a new checker', () => {
        const checker = new Checker({
            store: { data: [{ name: 'google', health: 'http://www.google.es' }] },
            reporter: { email: 'test@test.com' }
        });

        expect(checker).toBeInstanceOf(Checker);
        expect(checker.useStore).toBeDefined();
        expect(checker.check).toBeDefined();
        expect(Checker.request).toBeDefined();
    });

    test('Throw error if store options are not passed', () => {
        expect(() => {
            const checker = new Checker({
                reporter: { email: 'test@test.com' }
            });
        }).toThrow('Store options are required.');
    });

    test('Throw error if reporter options are not passed', () => {
        expect(() => {
            const checker = new Checker({
                store: { data: [{ name: 'google', health: 'http://www.google.es' }] },
            });
        }).toThrow('Reporter options are required.');
    });

    test('isHealthy true', () => {
        let mockHealthReport = [{
            service: "google",
            startTs: "2017-12-27T20:27:27.185Z",
            endTs: "2017-12-27T20:27:28.009Z",
            result: 200,
            duration: 824
        }]
        const checker = new Checker({
            store: { data: [{ name: 'google', health: 'http://www.google.es' }] },
            reporter: { email: 'test@test.com' }
        });

        expect(checker.isHealthy(mockHealthReport)).toBe(true);
    });

    test('isHealthy false', () => {
        let mockHealthReport = [{
            service: "google",
            startTs: "2017-12-27T20:27:27.185Z",
            endTs: "2017-12-27T20:27:28.009Z",
            result: 300,
            duration: 824
        }]
        const checker = new Checker({
            store: { data: [{ name: 'google', health: 'http://www.google.es' }] },
            reporter: { email: 'test@test.com' }
        });

        expect(checker.isHealthy(mockHealthReport)).toBe(false);
    });

    test('sendRequest is a Promise', () => {
        let req = Checker.request({ name: 'google', health: 'http://www.google.es', timeout: 3000 });

        expect(req).toBeInstanceOf(Promise);
    });

    test('sendRequest statusCode == 200', done => {
        Checker.request({ name: 'google', health: 'http://www.google.es', timeout: 3000 })
            .then(measure => {
                expect(measure).toBeInstanceOf(Measure);
                expect(measure.result).toBe(200);
                done();
            });
    });

    test('sendRequest statusCode != 200', done => {
        Checker.request({ name: 'google', health: 'http://www.google.es:81', timeout: 3000 })
            .then(measure => {
                expect(measure).toBeInstanceOf(Measure);
                expect(measure.result).not.toBe(200);
                done();
            });
    });

    test('sendRequest without timeout', () => {
        expect(Checker.request({ name: 'google', health: 'http://www.google.es' }))
            .reject;
    });
});