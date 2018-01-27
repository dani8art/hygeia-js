'use strict';
const { MemoryStore } = require('../store-memory');
const { Service } = require('../../domain/service');

describe('Stores - Memory', () => {

    test('Create memory store', done => {
        const store = new MemoryStore({
            data: [{ name: 'example', health: 'http://example.com' }]
        });

        store.get().then(data => {
            expect(data).toEqual([
                new Service({
                    name: 'example',
                    health: 'http://example.com',
                    method: 'GET',
                    timeout: 10000
                })
            ]);
            done();
        })
    });

    test('Throw error when any data is passed', () => {
        expect(() => {
            const store = new MemoryStore({});
        }).toThrow('Data is required.');
    });

});