var fs = require('fs'),
    path = require('path'),
    detection = require('./detection'),
    logger = require('./logger'),
    CloudInit = require('../../cloudinit-node');

var APP = function () {

}

APP.prototype = {

    detect: function (data) {
        // detect chef file type
        var filetype = detection.detect(data)
        // TODO we have an issue if we detect more than one value
        // ensure we just return one value
        return filetype[0]
    },

    convert: function (params, callback) {
        logger.info("input %s", params.input)

        var data = fs.readFileSync(params.input)
        var type = this.detect(data)

        logger.info("detected filetype %s", type)
        switch (type) {
        case 'CHEFDNA':
            var chefconfig = params.settings.get('chef')

            var ci = new CloudInit();
            var cloudinitConfig = {};
            cloudinitConfig.chef = {
                target: 'unix',
                dna: JSON.parse(data),
                validator_key: fs.readFileSync(path.resolve(params.settingsdirectory, chefconfig.validator_key)).toString(),
                client: {
                    validation_client_name: chefconfig.validation_client_name,
                    chef_server_url: chefconfig.chef_server_url
                }
            }

            logger.debug("generated chef config %s", JSON.stringify(cloudinitConfig));
            var self = this;
            ci.generate(cloudinitConfig, function (err, data) {
                // TODO catch storage error
                self.store(data, params.output)
                callback(null, data)
            })

            break;

        case 'CHEFROLE':
            callback("Chef roles are not supported yet");
            break;

        default:
            callback("Could not recognize the file");
            break;
        }
    },

    store: function (data, file) {
        if (file === null || file === undefined) {
            console.log(data);
        } else {
            logger.info('write file to %s', path.resolve(file.toString()))
            fs.writeFile(file.toString(), data, function (err) {
                if (err) throw err;
                logger.debug('successfully store file');
            });
        }
    }
};

module.exports = new APP()