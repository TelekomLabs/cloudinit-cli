var winston = require('winston');

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.File)({
            filename: 'log/cloudinit.log'
        })
    ]
});

module.exports = logger