jest.mock('http');
jest.mock('https');

const [http, https] = [require('http'), require('https')];

const httpReqObjectMock = {
    on: jest.fn(),
    setTimeout: jest.fn(),
    end: jest.fn(),
    abort: jest.fn(),
};

let expectedResponseStatus;
const httpReqFnMock = (opt, reqCallback) => {
    reqCallback({
        on: (event, resCallback) => { resCallback(); },
        statusCode: expectedResponseStatus,
    });
    return httpReqObjectMock;
};

http.request.mockImplementation(httpReqFnMock);
https.request.mockImplementation(httpReqFnMock);

const Checker = require('../../src');

describe('Checker Tests', () => {
    test('should create an instance of Checker', () => {
        const checker = new Checker({
            store: { data: [{ name: 'google', health: 'http://www.google.es' }] },
            reporter: { email: 'test@test.com' }
        });

        expect(checker).toBeInstanceOf(Checker);
    });

    test('should throw error if any store is passed', () => {
        expect(() => {
            const checker = new Checker({
                reporter: { email: 'test@test.com' }
            });
        }).toThrow('A store is required.');
    });

    test('should throw error if any reporter is passed', () => {
        expect(() => {
            const checker = new Checker({
                store: { data: [{ name: 'google', health: 'http://www.google.es' }] },
            });
        }).toThrow('At least 1 reporter is required.');
    });

    describe('#sendRequest', () => {
        const healthyService = { name: 'google', health: 'http://www.google.es', timeout: 3000 };
        const unHealthyService = { name: 'google', health: 'http://www.google.es:81', timeout: 3000 };

        test('should return a Promise instance', () => {
            const req = Checker.request(healthyService);

            expect(req).toBeInstanceOf(Promise);
        });

        test('should return measure status 200 when service is healthy', () => {
            expectedResponseStatus = 200;
            expect.assertions(1);
            return Checker
                .request(healthyService)
                .then(measure => expect(measure.health).toBe(expectedResponseStatus));
        });

        test('should return measure status ECONNRESET when service is unHealthy', () => {
            expectedResponseStatus = 'ECONNRESET';

            return Checker
                .request(unHealthyService)
                .then(measure => expect(measure.health).toBe(expectedResponseStatus));
        });

        test('should configure timeout properly', () => {
            return Checker
                .request(unHealthyService)
                .then(() => {
                    return expect(httpReqObjectMock.setTimeout)
                        .toHaveBeenCalledWith(unHealthyService.timeout, httpReqObjectMock.abort);
                });
        });

        test('should configure on error event properly', () => {
            return Checker
                .request(unHealthyService)
                .then(() => {
                    return expect(httpReqObjectMock.on)
                        .toHaveBeenCalledWith('error', expect.any(Function));
                });
        });

        test('should call req end', () => {
            return Checker
                .request(unHealthyService)
                .then(() => expect(httpReqObjectMock.end).toHaveBeenCalled());
        });
    });
});