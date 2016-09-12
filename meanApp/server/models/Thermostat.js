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