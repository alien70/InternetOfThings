# REST Api #
Prepariamo l'applicazione server con il comando npm init, e quindi installiamo i moduli che verranno utilizzati per l'implementazione della nostra Api.  

```
...$: npm install --save express
...$: npm install --save mongoose
...$: npm install --save node-restful
...$: npm install --save method-override
...$: npm install --save body-parser
...$: npm install --save lodash
```
## Bootstrap file ##
Creiamo il file *index.js* mediante il quale avvieremo il nostro server REST
``` javascript
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');

var port = 3000;

// Application entrypoint
var app = express();

// Add Middleware necessary for REST API's
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

// Add CORS Support
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost/nido');
mongoose.connection.once('open', function() {

	// Load the models
	app.models = require('./models/index');

	// Load the routes
	var routes = require('./routes');
	_.each(routes, function(controller, route) {
		app.use(route, controller(app, route));
	});

	console.log('Listening on port %s...', port);
	app.listen(port);
});
```
## Modello ##
Per agevolare la modellazione dei dati che salveremo nel db MongoDB, utilizzeremo il package [mongoose](http://mongoosejs.com/). Creata la cartella *models*, creiamo il modello dei dati di una lettura del nostro termostato nel file *Thermostat.js*
``` javascript
var mongoose = require('mongoose');

var ThermostatSchema = new mongoose.Schema({
	uid: {
		type: String,
		required: true
	},
	temperature: {
		type: Number,
	},
	humidity: {
		type: Number
	},
	timestamp: {
		type: Date
	}
});

// Exports the model schema
module.exports = ThermostatSchema;
```
## API ##
Per la creazione dell'API utilizzeremo il modulo [node-restful](https://github.com/baugarten/node-restful)
``` javascript
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
```
Fatta una chiamata al server dal browser, l'esito è:

![REST API Result](https://github.com/alien70/InternetOfThings/blob/master/images/REST%20API%20Call.png?raw=true)


