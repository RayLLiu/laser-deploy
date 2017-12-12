var finalhandler = require('finalhandler')
var http = require('http')
var Router = require('router')
var serverConfig = require('./config.js').serverConfig
var deployAPIendpoint = serverConfig.deployAPIendpoint

var router = Router()
router.post('/' + deployAPIendpoint, function (req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end('Hello World!')
})

var server = http.createServer(function (req, res) {
  router(req, res, finalhandler(req, res))
})

server.listen(serverConfig.PORT)
