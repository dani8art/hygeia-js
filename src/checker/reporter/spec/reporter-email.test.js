'use strict';
const { EmailReporter } = require('../reporter-email');

describe('Reporters - Email', () => {

    test('Create email reporter', () => {
        let reporter = new EmailReporter({
            email: 'test@test.com'
        });

        expect(reporter.email).toBe('test@test.com');
    });

    test('Throw error when any email is passed', () => {
        expect(() => {
            let reporter = new EmailReporter({});
        }).toThrow('Email in EmailReporter options is require.');
    });

    test('Test method buildSESOptions', () => {
        let reporter = new EmailReporter({
            email: 'test@test.com'
        });
        let statusChecking = [{ service: "statuschecker", startTs: "2017-12-20T18:48:37.981Z", endTs: "2017-12-20T18:48:38.918Z", result: 200, duration: 937 }];

        let sesOptions = reporter.buildSESOptions(statusChecking);

        expect(sesOptions.Destination.ToAddresses).toContain('test@test.com');
        expect(sesOptions.Message.Body.Html.Charset).toBe('UTF-8');
        expect(sesOptions.Message.Body.Html.Data).toMatchSnapshot();
        expect(sesOptions.Message.Subject.Charset).toBe('UTF-8');
        expect(sesOptions.Message.Subject.Data).toBe('Report [lambda-health-checker]');
        expect(sesOptions.Source).toBe('checker@darteaga.com');
    });
});