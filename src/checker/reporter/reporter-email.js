'use strict';
const AWS = require('aws-sdk');
const SES = new AWS.SES({ apiVersion: '2010-12-01' });

/**
 * This reporter sed the status checked by email using AWS.SES service.
 * @class EmailReporter
 */
class EmailReporter {

    /**
     * Creates an instance of EmailReporter.
     * @param {any} options 
     * @memberof EmailReporter
     */
    constructor(options) {
        if (!options.email)
            throw new Error('Email in EmailReporter options is require.');
        this.email = options.email;
    }

    /**
     * This method send email using AWS.SES service.
     * @param {any} statuschecking Status Cheking Object to send.
     * @returns {Promise<any>}
     * @memberof EmailReporter
     */
    send(statuschecking) {
        console.log('Sending email.');
        return SES.sendEmail(this.buildSESOptions(statuschecking)).promise();
    }

    /**
     *  This method build options object for AWS.SES service configuration
     * @param {any} statuschecking Status Checking Object to send
     * @returns {AWS.SES.SendEmailRequest}
     * @memberof EmailReporter
     */
    buildSESOptions(statuschecking) {
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
                        Data: JSON.stringify(statuschecking, null, 2)
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Report [lambda-status-checker]'
                }
            },
            Source: 'checker@darteaga.com',
        }
    }

    // TODO: buildMessageBody()
}

module.exports = { EmailReporter };