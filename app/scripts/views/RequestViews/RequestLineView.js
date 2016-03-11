var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;

// Import Collections
var Employees = require('../../collections/employees');

RequestLineView = Backbone.View.extend({
	tagName: 'tr',

	template: Handlebars.compile( $('#requestLine-row-template').html() ),

	events: {
		'click .deleteLine': 'delete'
	},

	render: function(){
		this.attrs = this.model ? this.model.attributes: null;
		this.$el.html( this.template({employees: this.collection.toJSON(), model: this.attrs }));
		return this;
	},

	delete: function(model){
		this.model.destroy();
	},

	onClose: function(){
		this.model.off('change',this.render);
		this.model.off('destroy',this.remove);
	}
});

module.exports = RequestLineView