const webpackConfig            = require( "./webpack.advance.config" )
const webpack                  = require( "webpack" )
const compiler                 = webpack( webpackConfig )
const opn                      = require('opn')
const WebpackDevServer         = require('webpack-dev-server')
const config                   = require('./config')

const server = new WebpackDevServer(compiler, {
    host: config.host,
    quiet: false,
    stats: {
        chunks: false,
        colors: true
    },
    // 这里不能有inline，暂不清楚原因
    hot: true
})

server.use(function (eq, res, next) {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})

server.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.send(err.message)
})

server.listen(config.port, (err)=>{
    if (err) {
        console.log(err)
        return
    }
    const url = `http://${config.host}:${config.port}/index.html`
    console.log('\x1B[36m%s\x1B[0m', url)
    if (process.env.NODE_ENV === 'development') {
        opn(url)
    }
})