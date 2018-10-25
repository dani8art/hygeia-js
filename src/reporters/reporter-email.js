/**
 * hygeia-js
 * Copyright (c) 2018 darteaga (https://github.com/dani8art/hygeia-js)
 * GPL-3.0 Licensed
 */

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
                        Data: this.buildMessageBody(healthReport) // JSON.stringify(healthReport, null, 2)
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Report [hygeia-healthcheck]'
                }
            },
            Source: 'hygeia@darteaga.com',
        }
    }

    buildMessageBody(healthReport) {

        let head = `
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
            <style>
                .card-title{text-transform: uppercase;}
                .card-body{padding: 10px 10px 10px 10px}
                .card{margin-bottom: 6px;}
                h6, .small{font-size: 80%;font-weight: 400;text-transform: none;}
            </style>    
        `;

        let services = '';
        healthReport.measures.forEach(s => {
            services += `
                <tr>
                    <td class="card-title">${s.service} <span class="small">(${s.duration} ms)</span></td>
                    <td class="text-center"> <span class="badge badge-pill badge-${s.health < 300 ? 'success' : 'danger'}">${s.health}</span></td>
                </tr>
            `;
        });

        let body = `
            <div class="container">
                <h4>Health Report</h4>
                <div class="row">
                <table class="table">
                    <tbody>
                    ${services}
                    </tbody>
                </table>
                </div>

                <p class="small text-center">hygeia-js v${healthReport.version} (${healthReport.environment})</p>
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

    parseDate(data) {
        return data.replace(/T/, ' ').replace(/\..+/, '');
    }
}

module.exports = { EmailReporter };