'use strict';

module.exports = {
    dev: {
        store: {
            // type: 'memory', 
            data: [
                {
                    name: 'google',
                    health: 'https://www.google.es',
                    method: 'GET'
                },
                {
                    name: 'error',
                    health: 'http://www.google.com:81',
                    method: 'GET'
                }
            ]
        },
        reporter: {
            //type: 'email',
            email: 'admin@darteaga.com',
            policy: 'always' // 'error'
        }
    },
    pre: {
        // Not in PRE yet
    },
    pro: {
        // Not in PRO yet
    }
}
