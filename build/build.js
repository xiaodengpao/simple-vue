const webpackConfig            = require( "./webpack.advance.config" )
const webpack                  = require( "webpack" )
webpack(webpackConfig, function (err, stats) {
	process.stdout.write(stats.toString({
	    colors: true,
	    modules: false,
	    children: false,
	    chunks: false,
	    chunkModules: false
	}) + '\n\n')
})