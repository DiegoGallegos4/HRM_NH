var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');

var resolveBowerPath = function(componentPath) {
    return path.join(__dirname, 'bower_components', componentPath);
};

module.exports = {

	resolve: {
		alias:{
			jquery: resolveBowerPath('/jquery/dist/jquery.js'),
			underscore: resolveBowerPath('/underscore/underscore.js'),
            backbone: resolveBowerPath('/backbone/backbone.js'),
            'bootstrap-sass': resolveBowerPath('/bootstrap-sass/assets/javascripts/bootstrap.js'),
            moment: resolveBowerPath('/moment/moment.js'),
            'eonasdan-bootstrap-datetimepicker': resolveBowerPath('/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js'),
            'oauth-js': resolveBowerPath('/oauth-js/dist/oauth.js'),
            'bootstrap-validator': resolveBowerPath('/bootstrap-validator/js/validator.js'),
            handlebars: resolveBowerPath('/handlebars/handlebars.js')
		},
		root: [
	      path.resolve('./node_modules'), 
	      path.resolve('./bower_components'), 
	    ],
    	moduleDirectories: ['bower_components']
	},

	entry: [
		'webpack-dev-server/client?http://localhost:3002',
	    'webpack/hot/only-dev-server',
		'./app/scripts/main.js'
	],

	output: {
		path: __dirname + '/dist/',
		filename: 'bundle.js',
		publicPath: '/dist/'
	},

	module: {
		loaders: [
			// HTML
			{ test: /\.html$/, loader: 'html' },
			// FONTS
			{ test: /\.(woff|woff2|ttf|eot|svg|otf)$/, loader: 'url', query: {limit: '1048576'} },
			// FILES:
      		{ test: /\.(jpe?g|jpg|png|gif)$/, loader: 'file'},
			// SASS
			{test: /\.scss/, loader: ExtractTextPlugin.extract("style-loader","css-loader",'sass-loader','postcss-loader') },
			// BABEL: JS|JSX
			{ test: /\.(js|jsx)$/, loaders: ['react-hot','babel?presets[]=es2015,presets[]=stage-2,presets[]=react'], include: path.join(__dirname,'app') , exclude: /(node_modules|bower_components)/}
		]
	},

	postcss: function () {
	    return [require('autoprefixer'), require('precss')];
	},

	plugins: [
	    new webpack.HotModuleReplacementPlugin(),
	    new ExtractTextPlugin('[name].css', { allChunks: true }),
	    new CopyWebpackPlugin([
	    	{from: 'app/index.html', to: 'dist/index.html'}
	    ])
	    
	],

	sassLoader: {
		includePaths: [path.resolve(__dirname, "./app/styles")]
	}
}