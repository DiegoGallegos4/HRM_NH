var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
window.jQuery = $;
window.$ = $;
window._ = _;


// CSS
// require('../styles/main.scss');

// Import app
var app = require('./routers/router');

// Enter Key make it global
window.ENTER_KEY = 13;


// Override sync to put a token on the header on every call for authentication purposes
var sync = Backbone.sync;
Backbone.sync = function(method, model, options){
    options.beforeSend = function(xhr){
        xhr.setRequestHeader('x-access-token', window.localStorage.token);
    }
    
    return sync.apply(this, [method, model, options]);
};

// Get the sepecific data from the server
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

// Clean Views after navigating away from view
Backbone.View.prototype.clean = function () {
    $('#containerList').css({
        'margin-top':'0px'
    });
	this.remove();
	this.unbind();
    _.each(this.subViews, function(subView){
	 	subView.clean();
	 	if(subView.onClose){ subView.onClose() }
    });
};

// Helper for Handlebars
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

// Kick off app
new app();

Backbone.history.start();
