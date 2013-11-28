'use strict';

var ChefDNA = function () {

}

ChefDNA.prototype = {
    name: 'CHEFDNA',
    detect: function (data) {

        var fits = false;

        // try to parse data
        try {
            var json = JSON.parse(data);
            if (json.run_list && json.json_class === undefined) {
                fits = true;
            }

        } catch  (err) {
            // nothing to do here
        }

        return fits;
    }
}

module.exports = new ChefDNA();