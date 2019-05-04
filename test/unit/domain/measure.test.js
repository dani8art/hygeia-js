'use strict';
const Measure = require('../../../src/domain/measure');

describe('Measure', () => {
    test('Create a new measure', () => {
        const measure = new Measure('test');

        expect(measure.service).toBe('test');
        expect(measure.startTs).toBeInstanceOf(Date);
    });

    test('Execute end() method', () => {
        const measure = new Measure('test');
        measure.end(200);

        expect(measure.health).toBe(200);
        expect(measure.endTs).toBeInstanceOf(Date);
    });

    test('Execute value() method', () => {
        let measure = new Measure('test');
        measure.end(200);

        measure = measure.value();
        expect(measure.duration).not.toBeNull;
    });

    test('Execute value() before end() throw err', () => {
        const measure = new Measure('test');
        expect(() => {
            measure = measure.value();
        }).toThrow('Can not call value() before end()');
    });
});