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
                }
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