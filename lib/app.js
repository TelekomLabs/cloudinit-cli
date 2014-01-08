'use strict';

var fs = require('fs'),
    path = require('path'),
    detection = require('./detection'),
    logger = require('./logger'),
    CloudInit = require('cloudinit');

var APP = function () {

}

APP.prototype = {

    merge: function (obj1, obj2) {
        var obj3 = {};
        var attr;

        for (attr in obj1) {
            if (obj1.hasOwnProperty(attr)) {
                obj3[attr] = obj1[attr]
            }
        }

        for (attr in obj2) {
            if (obj2.hasOwnProperty(attr)) {
                obj3[attr] = obj2[attr]
            }
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

    chefdna: function (params, data, callback) {
        var chefconfig = params.settings.get('chef')
        var validator_key_path = path.resolve(params.settingsdirectory, chefconfig.validator_key)
        var validator_key = fs.readFileSync(validator_key_path).toString()
        var cloudinitConfig = {}
        cloudinitConfig.chef = {
            target: 'unix',
            dna: JSON.parse(data),
            validator_key: validator_key,
            client: {
                validation_client_name: chefconfig.validation_client_name,
                chef_server_url: chefconfig.chef_server_url
            }
        }

        logger.debug('generated chef config')
        this.chef(cloudinitConfig, params.output, callback)
    },

    chefrole: function (params, data, callback) {
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

        logger.debug('generated chef config')
        this.chef(cloudinitConfig, params.output, callback)
    },

    convert: function (params, callback) {
        logger.info('input %s', params.input)

        var data = fs.readFileSync(params.input)
        var type = this.detect(data)

        logger.info('detected filetype %s', type)
        switch (type) {
        case 'CHEFDNA':
            this.chefdna(params, data, callback)
            break;

        case 'CHEFROLE':
            this.chefrole(params, data, callback)
            break;

        default:
            console.log('Input format not recognized');
            logger.info('Input format not recognized');
            callback('Could not recognize the file')
            break;
        }
    },

    store: function (data, file) {
        if (file === null ||  file === undefined) {
            console.log(data);
        } else {
            logger.info('output %s', path.resolve(file.toString()))
            fs.writeFile(file.toString(), data, function (err) {
                if (err) {
                    throw err;
                }
                logger.debug('successfully store file');
            });
        }
    }
};

module.exports = new APP()