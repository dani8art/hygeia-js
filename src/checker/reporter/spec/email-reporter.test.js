'use strict';
const { EmailReporter } = require('../email-reporter');

describe('Reporters - Email', () => {

    test('Create email reporter', () => {
        let reporter = new EmailReporter({
            email: 'test@test.com'
        });

        expect(reporter.email).toBe('test@test.com');
    });

    test('Throw error when any items it is passed', () => {
        expect(() => {
            let schema = new ArraySchema();
            schema.toJson();
        }).toThrow();
    });

});