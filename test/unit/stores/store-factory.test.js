'use strict';
const { MemoryStore } = require('../../../src/stores');
const { createStore } = require('../../../src/stores');

describe('Stores - Store Factory', () => {
    test('Create a memory store', () => {
        const reporter = createStore({
            data: [{ name: 'example', health: 'http://example.com' }]
        });

        expect(reporter).toBeInstanceOf(MemoryStore);
    });

    test('Create an unavailable/unimplemented reporter', () => {
        expect(() => {
            const reporter = createStore({
                type: 'elastic'
            });
        }).toThrow('This type of store is not implemented.');
    });
});