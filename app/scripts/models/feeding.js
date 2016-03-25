var Backbone = require('backbone');

var Feeding = Backbone.Model.extend({
	defaults: {
		employeeID: '' ,
		price: 0.0,
		confirm: false,
		requestID: '',
		date: '',
		payment: false,
		pin: '',
		feedingType: ''
	},

	urlRoot: 'http://localhost:4003/api/feedings',
});

module.exports = Feeding;
