var app = app || {};

(function(){
	var RequestList = Backbone.Collection.extend({
		model: app.Request,

		url: 'http://localhost:4003/api/requests',

		filterByDate: function(date){
			if(date == '') return this;

			var pattern = new RegExp(date,"gi");
			return _(this.filter(function(data){
				return pattern.test(data.get('date'));
			}));
		}
	});

	app.Requests = new RequestList();
}());