'use strict';
const { MemoryStore } = require('../store-memory');

describe('Stores - Memory', () => {

    test('Create memory store', done => {
        const store = new MemoryStore({
            data: { example: 'example' }
        });

        store.get().then(data => {
            expect(data).toEqual({ example: 'example' });
            done();
        })
    });

    test('Throw error when any data is passed', () => {
        expect(() => {
            const store = new MemoryStore({});
        }).toThrow('Data is required.');
    });

});