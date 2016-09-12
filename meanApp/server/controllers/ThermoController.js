var restful = require('node-restful');

module.exports = function(app, route) {
    var rest = restful.model(
        'thermostat',
        app.models.thermostat).methods(['get', 'post', 'put', 'delete']);

    // Rest the endpoint with the application
    rest.register(app, route);

    // Return the middleware
    return function(req, res, next) {
        next()
    };
};
