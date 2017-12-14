'use strict';
const AWS = require('aws-sdk');
const SES = new AWS.SES({ apiVersion: '2010-12-01' });

class EmailReporter {

    constructor(options) {
        if (!options.email)
            throw new Error('Email in EmailReporter options is require.');
        this.email = options.email;
    }

    send(statuschecking) {
        console.log('sending email.');
        return SES.sendEmail(this.buildSESOptions(statuschecking)).promise();
    }


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
                        Charset: "UTF-8",
                        Data: JSON.stringify(statuschecking, null, 2)
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Report [lambda-status-checker]"
                }
            },
            Source: "checker@darteaga.com",
        }
    }

    // TODO: buildMessageBody()
}

module.exports = { EmailReporter };