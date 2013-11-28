'use strict';

var winston = require('winston');

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.File)({
            filename: 'log/cloudinit.log',
            level: 'debug'
        })
    ]
});

module.exports = logger