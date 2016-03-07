var Backbone = require('backbone');

Feeding = Backbone.Model.extend({
	defaults: {
		employeeID: '' ,
		price: 0.0,
		confirm: false,
		requestID: '',
		date: '',
		payment: false,
		pin: '',
		feedingType: ''
	}
});

module.exports = Feeding;
