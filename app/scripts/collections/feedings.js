var app = app || {};

(function(){
	var FeedingList = Backbone.Collection.extend({
		model: app.FeedingControl,

		url: 'http://localhost:4003/api/feedings',

		search: function(phrase){
			if(phrase == '') return this;

			var pattern = new RegExp(phrase,"gi");
			return _(this.filter(function(data){
				return pattern.test(data.get('employeeID'));
			}));
		},

		filterByDate: function(date){
			if(date == '') return this;
			var ms = []
			this.models.forEach(function(model){
				if(Date.parse(model.get('date')) == Date.parse(date)){
					ms.push(model);
				}
			});
			return ms;
		}
	});

	app.Feedings = new FeedingList();
}());