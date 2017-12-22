'use strict';
const { Checker } = require('../');

describe('Checker', () => {
    test('Create a new checker', () => {
        const checker = new Checker({
            store: { data: { name: 'google', health: 'http://www.google.es' } },
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
                store: { data: { name: 'google', health: 'http://www.google.es' } },
            });
        }).toThrow('Reporter options are required.');
    });

});