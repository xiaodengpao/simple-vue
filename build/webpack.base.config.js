const path                    = require('path')
const HtmlWebpackPlugin       = require('html-webpack-plugin')
const rootPath                = path.resolve(__dirname, '../')
const ExtractTextPlugin 	  = require('extract-text-webpack-plugin')
const webpack                 = require('webpack')

module.exports = {	
    entry: {
        index: path.join(rootPath, '/src/entry/index.js'),
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': path.join(rootPath, '/src/'),
        }
    },
    module: {        
        rules: [{
            test: /\.(js|vue)$/,
            enforce: 'pre',
            include: path.join(rootPath, '/src/'),
            loader: "eslint-loader"
        },{
            test: /\.js$/,
            include: path.join(rootPath, '/src/'),
            exclude: /node_modules|vue\/dist|vue-loader\/|vue-hot-reload-api\//,
            loader: ['babel-loader']
        },{
            test: /\.css$/,
            exclude: /(node_modules)/,
            loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!postcss-loader' })
        },{
            test: /\.scss$/,
            exclude: /(node_modules)/,
            loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!postcss-loader!sass-loader' })
        },{
            test: /\.jpg$/,
            loader: "file-loader"
        },{
            test: /\.(png|gif|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000'
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"' + process.env.NODE_ENV +'"'
            }
        })
    ]
}


