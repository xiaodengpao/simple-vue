const baseWebpackConfig       = require( './webpack.base.config' )
const merge                   = require( 'webpack-merge' )
const path   				  = require( 'path' )
const webpack                 = require( 'webpack' )
const env                     = process.env.NODE_ENV
const rootPath                = path.resolve(__dirname, '../')
const ExtractTextPlugin 	  = require('extract-text-webpack-plugin')
const htmlWebpackPlugin       = require('html-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const config                  = require('./config')

const developmentConfig = merge( baseWebpackConfig, {
	output: {
		path: path.join(rootPath, 'dist'),
		publicPath: '/',
		filename: 'js/[name].js'
	},

	entry: {
		index: [`webpack-dev-server/client?http://${config.host}:${config.port}`, "webpack/hot/dev-server"].concat(baseWebpackConfig.entry.index),
	},

    devtool: '#source-map',

    plugins: [
	    new htmlWebpackPlugin({
	        filename: path.join(rootPath, 'dist/index.html'),
	        template: path.join(rootPath, 'src/entry/index.html'),
	        inject: false,
	        files: {
	            chunks: {
	                index: {
	                    entry: "./index.js",
	                    css: "./index.css"
	                }
	            }
	        }
	    }),
	    // 抽取CSS并合并输出
	    new ExtractTextPlugin('styles/[name].css'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
	    new webpack.NoEmitOnErrorsPlugin(),
	    new webpack.NamedModulesPlugin()
	]
})

const productionConfig = merge( baseWebpackConfig, {
	output: {
		path: path.join(rootPath, './dist'),
		filename: 'js/[name][chunkhash:8].js',
		publicPath: './'
	},
    plugins: [
	    new htmlWebpackPlugin({
	        filename: path.join(rootPath, 'dist/index.html'),
	        template: path.join(rootPath, 'src/entry/index.html'),
	        inject: false,
	        files: {
	            chunks: {
	                index: {
	                    entry: "./index.js",
	                    css: "./index.css"
	                }
	            }
	        }
	    }),
	    // 抽取CSS并合并输出
	    new ExtractTextPlugin('styles/[name][chunkhash:8].css'),

	    new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new OptimizeCssAssetsPlugin()
	]
})


const envToConfig = {
	'development': developmentConfig,
	'production': productionConfig
}
// 输出和当前环境对应的配置文件
module.exports = envToConfig[process.env.NODE_ENV]