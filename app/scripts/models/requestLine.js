var Backbone = require('backbone');

var RequestLine = Backbone.Model.extend({
	defaults: {
		requestID: '',
		employeeID: '',
		feeding: true,
		transportation: false,
		approved: false,
		transportationConfirmation: false
	},

	urlRoot: 'http://localhost:4003/api/requestLines'
});

module.exports = RequestLine;
