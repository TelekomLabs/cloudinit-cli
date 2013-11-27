var fs = require('fs'),
    path = require('path'),
    detection = require('./detection'),
    logger = require('./logger'),
    CloudInit = require('../../cloudinit-node');

var APP = function () {

}

APP.prototype = {

    merge: function merge_options(obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    },

    detect: function (data) {
        // detect chef file type
        var filetype = detection.detect(data)
        // TODO we have an issue if we detect more than one value
        // ensure we just return one value
        return filetype[0]
    },

    chef: function (cloudinitConfig, output, callback) {
        var ci = new CloudInit();
        var self = this;
        ci.generate(cloudinitConfig, function (err, data) {
            // TODO catch storage error
            self.store(data, output)
            callback(null, data)
        })
    },

    convert: function (params, callback) {
        logger.info("input %s", params.input)

        var data = fs.readFileSync(params.input)
        var type = this.detect(data)

        logger.info("detected filetype %s", type)
        switch (type) {
        case 'CHEFDNA':
            var chefconfig = params.settings.get('chef')

            var cloudinitConfig = {}
            cloudinitConfig.chef = {
                target: 'unix',
                dna: JSON.parse(data),
                validator_key: fs.readFileSync(path.resolve(params.settingsdirectory, chefconfig.validator_key)).toString(),
                client: {
                    validation_client_name: chefconfig.validation_client_name,
                    chef_server_url: chefconfig.chef_server_url
                }
            }

            logger.debug("generated chef config")
            this.chef(cloudinitConfig, params.output, callback)
            
            break;

        case 'CHEFROLE':
            var chefconfig = params.settings.get('chef')

            // generate dna
            var role = JSON.parse(data)

            // merge into dna
            var dna = this.merge(role.override_attributes, role.default_attributes)

            // add run list
            dna.run_list = role.run_list

            var cloudinitConfig = {};
            cloudinitConfig.chef = {
                target: 'unix',
                dna: dna,
                validator_key: fs.readFileSync(path.resolve(params.settingsdirectory, chefconfig.validator_key)).toString(),
                client: {
                    validation_client_name: chefconfig.validation_client_name,
                    chef_server_url: chefconfig.chef_server_url
                }
            }

            logger.debug("generated chef config")
            this.chef(cloudinitConfig, params.output, callback)

            break;

        default:
            callback("Could not recognize the file")
            break;
        }
    },

    store: function (data, file) {
        if (file === null ||  file === undefined) {
            console.log(data);
        } else {
            logger.info('output %s', path.resolve(file.toString()))
            fs.writeFile(file.toString(), data, function (err) {
                if (err) throw err;
                logger.debug('successfully store file');
            });
        }
    }
};

module.exports = new APP()