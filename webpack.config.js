const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  module: {
	rules: [
	  {
		test: /\.js$/,
		exclude: /node_modules/,
		use: {
		  loader: "babel-loader"
		}
	  }, {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }, {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader?name=public/fonts/[name].[ext]'
	  }, {
		test: /\.scss$/,
		use: [
			"style-loader", // creates style nodes from JS strings
			"css-loader", // translates CSS into CommonJS
			"sass-loader" // compiles Sass to CSS, using Node Sass by default
		]
	  }, {
		test: /\.(gif|png|jpe?g|svg|ico)$/i,
  		use: [{
			loader: 'file-loader',
			options: {
				name: '[name].[ext]',
				outputPath: '../images/',
			},
		}]
	  }
	]
  },
  optimization: {
    minimizer: [
	  new UglifyJsPlugin({
		test: /\.js/
	  })
    ]
  },
  plugins: [
    new CompressionPlugin({
		test: /\.js/
	})
  ]
};