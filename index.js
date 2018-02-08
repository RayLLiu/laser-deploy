var serverConfig = require('./config.json')
var deployAPIendpoint = serverConfig.deployAPIendpoint
var express = require('express')
var path = require('path')
const bodyParser = require('body-parser')
var _ = require('lodash')
var Util = require('./services/util.js')
var utilService = new Util()
var app = express()
var fs = require('fs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.post('/' + deployAPIendpoint, function (req, res) {
  console.log(req.body)
  if (req.body.ref !== 'refs/heads/master') {
    console.log('Non master change, ignore')
    res.status(500).send('Non master change, ignore')
  } else {
    // find secret
    var repo = _.find(serverConfig.repos, { fullName: req.body.repository.full_name })
    if (!repo) {
      console.log('Repo not registered')
      res.status(500).send('Repo not registered')
    } else {
      var auth = utilService.verifySecret(repo.secret, req)
      if (!auth) {
        console.log('Wrong Secret')
        res.status(500).send('Wrong Secret')
      } else {
        // execute git pull
        utilService.updateRepo(repo)
      }
    }
  }
})

app.get('/admin/:password', function (req, res) {
  if (req.params.password === serverConfig.adminPassword && serverConfig.adminEnabled) {
    // res.send('ok').status(200)
    res.render('index')
  } else {
    res.send('in correct password').status(404)
  }
})

app.post('/addrepo', function (req, res) {
  if (req.body.password === serverConfig.adminPassword && serverConfig.adminEnabled && !_.some(req.body, function (value) { return value === '' })) {
    var repo = _.pick(req.body, ['fullPath', 'fullName', 'secret', 'restartService', 'pm2ProcessID'])
    if (!_.find(serverConfig.repos, {fullName: repo.fullName})) {
      serverConfig.repos.push(repo)
      fs.writeFile('./config.json', JSON.stringify(serverConfig), function () { console.log('done') })
    }
    res.send('success')
  } else {
    res.send('in correct password').status(404)
  }
})

app.listen(serverConfig.PORT)
