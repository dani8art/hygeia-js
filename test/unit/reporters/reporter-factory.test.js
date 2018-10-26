'use strict';
const { EmailReporter } = require('../../../src/reporters');
const { createReporter } = require('../../../src/reporters');

describe('Reporters - Reporter Factory', () => {
    test('Create an email reporter', () => {
        const reporter = createReporter({
            email: 'test@test.com'
        });

        expect(reporter).toBeInstanceOf(EmailReporter);
    });

    test('Create an unavailable/unimplemented reporter', () => {
        expect(() => {
            const reporter = createReporter({
                type: 'elastic'
            });
        }).toThrow('This type of reporter is not implemented.');
    });
});