'use strict';
const { MemoryStore } = require('../../../src/checker/stores/store-memory');
const { createStore } = require('../../../src/checker/stores/');

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