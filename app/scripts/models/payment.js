var Backbone = require('backbone');

Payment = Backbone.Model.extend({
	defaults: {
		employee_id: 1,
		quantity: 123.0,
		feeding_id: 2
	}
});
module.exports = Payment;

