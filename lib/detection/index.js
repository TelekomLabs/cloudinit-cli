'use strict';

var ChefDNA = require('./chefdna'),
    ChefRole = require('./chefrole');

var mechanism = [ChefDNA, ChefRole];

function detect (data) {
    var found = [];
    for (var i = 0; i < mechanism.length; i++) {
        if (mechanism[i].detect(data)) {
            found.push(mechanism[i].name);
        }
    }
    return found;
}

module.exports = {
    detect: detect
}