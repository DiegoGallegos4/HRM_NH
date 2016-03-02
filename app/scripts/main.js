var app = app || {};
var ENTER_KEY = 13;

$(function(){ 
	Backbone.View.prototype.close = function () {
	    this.remove();
	    this.unbind();
	};

	Backbone.View.prototype.helper = Handlebars.registerHelper('printDate',function(date){
			var current = new Date(date);
			var dd = current.getDate() < 10 ? '0' + current.getDate() : current.getDate();
			var mm = current.getMonth() < 10 ? '0' + (current.getMonth() + 1) : current.getMonth() + 1;
			var yy = current.getFullYear();
			var result = yy+'-'+mm+'-'+dd;
			return result;
		});

});