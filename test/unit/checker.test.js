'use strict';
const { Checker } = require('../../src');
const { Measure } = require('../../src/domain');

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

    test('sendRequest is a Promise', () => {
        let req = Checker.request({ name: 'google', health: 'http://www.google.es', timeout: 3000 });

        expect(req).toBeInstanceOf(Promise);
    });

    test('sendRequest statusCode == 200', done => {
        Checker.request({ name: 'google', health: 'http://www.google.es', timeout: 3000 })
            .then(measure => {
                expect(measure).toBeInstanceOf(Measure);
                expect(measure.health).toBe(200);
                done();
            });
    });

    test('sendRequest statusCode != 200', done => {
        Checker.request({ name: 'google', health: 'http://www.google.es:81', timeout: 3000 })
            .then(measure => {
                expect(measure).toBeInstanceOf(Measure);
                expect(measure.health).not.toBe(200);
                done();
            });
    });

    test('sendRequest without timeout', () => {
        expect(Checker.request({ name: 'google', health: 'http://www.google.es' }))
            .reject;
    });
});