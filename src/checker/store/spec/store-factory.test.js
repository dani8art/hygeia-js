'use strict';
const { MemoryStore } = require('../store-memory');
const { createStore } = require('../');

describe('Stores - Store Factory', () => {
    test('Create a memory store', () => {
        const reporter = createStore({
            data: { test: 'test' }
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