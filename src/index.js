'use strict';
const { Checker } = require('./checker');

exports.handler = (event, context, callback) => {

    const checker = new Checker({
        store: {
            // type: 'memory', 
            data: [
                {
                    name: 'playkidspark',
                    health: 'https://www.playkidspark.es/sitemap.xml',
                    method: 'GET'
                },
                {
                    name: 'blog',
                    health: 'https://darteaga.com',
                    method: 'GET'
                },
                {
                    name: 'pets',
                    health: 'https://pets.darteaga.com',
                    method: 'GET'
                },
                // {
                //     name: 'error',
                //     health: 'http://www.google.com:81',
                //     method: 'GET'
                // }
            ]
        },
        reporter: {
            //type: 'email',
            email: 'admin@darteaga.com'
        }
    });

    checker.check()
        .then(() => callback(null, 'Status checked for all the services.'))
        .then((err => callback(err)));

}