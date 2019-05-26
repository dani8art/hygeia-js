jest.mock('http');
jest.mock('https');
jest.mock('url');
jest.mock('../../src/domain/measure');

let mockIsHealthy = jest.fn(() => true);
const mockAddMeasure = jest.fn();
const mockStart = jest.fn();
jest.mock('../../src/domain/health-report', () => {
    return jest.fn().mockImplementation(() => {
        return { addMeasure: mockAddMeasure, start: mockStart, end: jest.fn(), isHealthy: mockIsHealthy };
    })
});

jest.mock('../../src/domain/service');

const [http, https] = [require('http'), require('https')];
const url = require('url');

let reqEventMapMock = {};
let resEventMapMock = {};

let expectedResponseStatus;
const httpReqObjectMock = {
    on: jest.fn().mockImplementation((event, onCallback) => {
        reqEventMapMock[event] = onCallback;
    }),
    setTimeout: jest.fn(),
    end: jest.fn().mockImplementation(() => {
        if (expectedResponseStatus !== 200) {
            return reqEventMapMock.error({ code: expectedResponseStatus });
        } else {
            return resEventMapMock.end();
        }
    }),
    abort: jest.fn(),
};

const httpReqFnMock = (opt, reqCallback) => {
    reqCallback({
        on: (event, resCallback) => {
            resEventMapMock[event] = resCallback;
        },
        statusCode: expectedResponseStatus,
    });
    return httpReqObjectMock;
};

url.parse.mockReturnValue({
    protocol: 'protocol', hostname: 'hostname', port: 'port', pathname: 'pathname', search: 'search'
});
http.request.mockImplementation(httpReqFnMock);
https.request.mockImplementation(httpReqFnMock);

const Checker = require('../../src');
const Measure = require('../../src/domain/measure');
const HealthReport = require('../../src/domain/health-report');
const Service = require('../../src/domain/service');

describe('Checker Tests', () => {
    const healthyService = { name: 'healthy', health: 'http://www.google.es', timeout: 3000 };
    const unHealthyService = { name: 'unHealthy', health: 'http://www.google.es:81', timeout: 3000 };

    afterEach(() => {
        reqEventMapMock = {};
        resEventMapMock = {};
        jest.clearAllMocks();
    });

    beforeEach(() => {
        Service.mockImplementation(() => {
            return { name: 'healthy', health: 'http://www.google.es', timeout: 3000 }
        });
    });

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

        test('should return a Promise instance', () => {
            const req = Checker.request(healthyService);

            expect(req).toBeInstanceOf(Promise);
        });

        test('should return measure status 200 when service is healthy', () => {
            expect.assertions(2);
            expectedResponseStatus = 200;

            return Checker
                .request(healthyService)
                .then(measure => {
                    expect(Measure).toHaveBeenCalledWith(healthyService.name);
                    expect(measure.end).toHaveBeenCalledWith(expectedResponseStatus);
                });
        });

        test('should return measure status ECONNRESET when service is unHealthy', () => {
            expect.assertions(2);
            expectedResponseStatus = 'ECONNRESET';

            return Checker
                .request(unHealthyService)
                .then(measure => {
                    expect(Measure).toHaveBeenCalledWith(unHealthyService.name);
                    expect(measure.end).toHaveBeenCalledWith(expectedResponseStatus);
                });
        });

        test('should configure timeout properly', () => {
            expect.assertions(1);

            return Checker
                .request(unHealthyService)
                .then(() => {
                    return expect(httpReqObjectMock.setTimeout)
                        .toHaveBeenCalledWith(unHealthyService.timeout, httpReqObjectMock.abort);
                });
        });

        test('should configure on error event properly', () => {
            expect.assertions(1);

            return Checker
                .request(unHealthyService)
                .then(() => {
                    return expect(httpReqObjectMock.on)
                        .toHaveBeenCalledWith('error', expect.any(Function));
                });
        });

        test('should call req end', () => {
            expect.assertions(1);

            return Checker
                .request(unHealthyService)
                .then(() => expect(httpReqObjectMock.end).toHaveBeenCalled());
        });
    });

    describe('#check', () => {
        const storeMock = { get: jest.fn().mockImplementation(() => Promise.resolve([healthyService])) };
        const reporterMock = { send: jest.fn().mockImplementation(() => Promise.resolve()) };
        let myChecker;

        beforeEach(() => {
            myChecker = new Checker({ store: storeMock, reporter: reporterMock });
        });

        test('should return a Promise', () => {
            expect(myChecker.check()).toBeInstanceOf(Promise);
        });

        test('should create a health report and start it', () => {
            expect.assertions(2);

            return myChecker
                .check()
                .then(() => {
                    expect(HealthReport).toHaveBeenCalledTimes(1);
                    expect(mockStart).toHaveBeenCalledTimes(1);
                });
        });

        test('should create one instances of the services and add measures', () => {
            expect.assertions(2);

            return myChecker
                .check()
                .then(() => {
                    expect(Service).toHaveBeenCalledTimes(1);
                    expect(mockAddMeasure).toHaveBeenCalledTimes(1);
                });
        });

        describe('if reporter policy is error', () => {
            beforeEach(() => {
                reporterMock.policy = 'error';
            });

            test('should send report if there are errors', () => {
                expect.assertions(1);
                mockIsHealthy = jest.fn(() => false);

                return myChecker
                    .check()
                    .then(() => {
                        expect(reporterMock.send).toHaveBeenCalledTimes(1);
                    });
            });

            test('should not send report if there are not errors', () => {
                expect.assertions(1);
                mockIsHealthy = jest.fn(() => true);

                return myChecker
                    .check()
                    .then(() => {
                        expect(reporterMock.send).not.toHaveBeenCalled();
                    });
            });
        });

        describe('if reporter policy is always', () => {
            beforeEach(() => {
                reporterMock.policy = 'always';
            })

            test('should send report if there are errors', () => {
                expect.assertions(1);
                mockIsHealthy = jest.fn(() => false);

                return myChecker
                    .check()
                    .then(() => {
                        expect(reporterMock.send).toHaveBeenCalledTimes(1);
                    });
            });

            test('should send report if there are not errors', () => {
                expect.assertions(1);
                mockIsHealthy = jest.fn(() => true);

                return myChecker
                    .check()
                    .then(() => {
                        expect(reporterMock.send).toHaveBeenCalled();
                    });
            });
        });

        test('should send report and reject the promise', () => {
            expect.assertions(1);
            Service.mockImplementation(() => {
                throw new Error('some error');
            });

            return myChecker
                .check()
                .catch(() => {
                    expect(reporterMock.send).toHaveBeenCalled();
                });

        });

    });
});