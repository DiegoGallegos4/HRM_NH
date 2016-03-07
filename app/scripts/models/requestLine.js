var Backbone = require('backbone');

RequestLine = Backbone.Model.extend({
	defaults: {
		requestID: '',
		employeeID: '',
		feeding: false,
		transportation: false,
		approved: false,
		transportationConfirmation: false
	},

	urlRoot: 'http://localhost:4003/api/requestLines'
});

module.exports = RequestLine;
