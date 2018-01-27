'use strict';
const { Service } = require('../../../src/checker/domain/service');

describe('Service', () => {

    test('Create a new service', () => {
        const service = new Service({
            name: 'Google',
            health: 'http://google.es',
            method: 'GET',
            timeout: 12
        });

        expect(service.name).toBe('Google');
        expect(service.health).toBe('http://google.es');
        expect(service.method).toBe('GET');
        expect(service.timeout).toBe(12);
    });

    test('Name is required', () => {
        expect(() => {
            const service = new Service({
                health: 'http://google.es'
            });
        }).toThrow('name property is required on type Service.');
    });

    test('Health is required', () => {
        expect(() => {
            const service = new Service({
                name: 'Google'
            });
        }).toThrow('health property is required on type Service.');
    });

    test('Timeout must be number', () => {
        expect(() => {
            const service = new Service({
                name: 'Google',
                health: 'http://google.es',
                timeout: '10000'
            });
        }).toThrow('timeout property must be a number.');
    });

    test('Default values', () => {
        const service = new Service({
            name: 'Google',
            health: 'http://google.es'
        });

        expect(service.method).toBe('GET');
        expect(service.timeout).toBe(Service.DEFAULT_TIMEOUT);
    });

    test('JSON Schema', () => {
        expect(Service.getJSONSchema()).toMatchSnapshot();
    });
});