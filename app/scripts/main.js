var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
window.jQuery = $;
window.$ = $;
window._ = _;
// Import app
var app = require('./routers/router');

// Enter Key make it global
window.ENTER_KEY = 13;

var sync = Backbone.sync;

Backbone.sync = function(method, model, options){
    options.beforeSend = function(xhr){
        xhr.setRequestHeader('x-access-token', window.localStorage.token);
    }
    
    return sync.apply(this, [method, model, options]);
};

Backbone.Collection.prototype.parse = function(response){
    if(_.isObject(response.profile)){
        window.localStorage.profile = response.profile.role;
    };

    if(_.isObject(response.data)){
        return response.data
    }else{
        return response
    }
};

// Cleans Views after leaving
Backbone.View.prototype.clean = function () {
	this.remove();
	this.unbind();
    _.each(this.subViews, function(subView){
	 	subView.clean();
	 	if(subView.onClose){ subView.onClose() }
    });
};

Backbone.View.prototype.helper = Handlebars.registerHelper('printDate',function(date){
		var current = new Date(date);
		var dd = current.getDate() < 10 ? '0' + current.getDate() : current.getDate();
		var mm = current.getMonth() < 10 ? '0' + (current.getMonth() + 1) : current.getMonth() + 1;
		var yy = current.getFullYear();
		var result = yy+'/'+mm+'/'+dd;
		return result;
});

Backbone.View.prototype.BooleanHelper = Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

new app();

Backbone.history.start();
