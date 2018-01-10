'use strict';
const AWS = require('aws-sdk');
const SES = new AWS.SES({ apiVersion: '2010-12-01' });

/**
 * This reporter send the checked health by email using AWS.SES service.
 * @class EmailReporter
 */
class EmailReporter {

    /**
     * Creates an instance of EmailReporter.
     * @param {any} options 
     * @memberof EmailReporter
     */
    constructor(options) {
        this.name = 'EmailReporter';
        if (!options.email)
            throw new Error('Email in EmailReporter options is require.');
        this.email = options.email;
        this.policy = options.policy || 'always';
    }

    /**
     * This method send email using AWS.SES service.
     * @param {any} healthReport Checked healthReport object to send.
     * @returns {Promise<any>}
     * @memberof EmailReporter
     */
    send(healthReport) {
        return SES.sendEmail(this.buildSESOptions(healthReport)).promise();
    }

    /**
     *  This method build options object for AWS.SES service configuration
     * @param {any} healthReport Checked healthReport object to send
     * @returns {AWS.SES.SendEmailRequest}
     * @memberof EmailReporter
     */
    buildSESOptions(healthReport) {
        return {
            Destination: {
                ToAddresses: [
                    this.email
                ]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: this.buildMessageBody(healthReport.measures) // JSON.stringify(healthReport, null, 2)
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Report [lambda-health-checker]'
                }
            },
            Source: 'checker@darteaga.com',
        }
    }

    buildMessageBody(health) {
        let head = `
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
            <style>
                .card-title{text-transform: uppercase;}
                .card{margin-bottom: 5px;}
                h6{font-size: 80%;font-weight: 400;}
            </style>    
        `;

        let services = '';
        health.forEach(s => {
            services += `
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${s.service} <span class="float-right badge badge-pill badge-${s.health < 300 ? 'success' : 'danger'}">${s.health}</span></h5>
                            <h6 class="card-subtitle mb-2 text-muted">${s.startTs.replace(/T/, ' ').replace(/\..+/, '')}</h6>
                            <p class="card-text">
                                <b>Duration: </b> ${s.duration} ms
                            </p>
                        </div>
                    </div>
                </div>
            `;
        });

        let body = `
            <div class="container">
                <h3>Health report</h3>
                <div class="row">
                    ${services}
                </div>
            </div>
        `;

        let html = `
            <!DOCTYPE html>
            <html>
                <head>
                ${head}
                </head>
                <body>
                ${body}
                </body>
            </html>
        `
        return html;
    }
}

module.exports = { EmailReporter };