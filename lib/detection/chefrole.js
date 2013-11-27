var ChefRole = function () {

}

ChefRole.prototype = {
    name: 'CHEFROLE',
    detect: function (data) {
        var fits = false;

        // try to parse data
        try {
            var json = JSON.parse(data);
            if (json.json_class === 'Chef::Role') {
                fits = true;
            }

        } catch (err) {
            // nothing to do here
        }

        return fits;
    }
}

module.exports = new ChefRole();