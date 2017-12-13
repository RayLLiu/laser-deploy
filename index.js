
var serverConfig = require('./config.js').serverConfig
var deployAPIendpoint = serverConfig.deployAPIendpoint
var express = require('express')
const bodyParser = require('body-parser')
var verifyGithubWebhook = require('verify-github-webhook')
var _ = require('lodash')
var sys = require('sys')
var exec = require('child_process').exec

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/' + deployAPIendpoint, function (req, res) {
  console.log(req.body)
  if (req.body.ref !== 'refs/heads/master') {
    console.log('Non master change, ignore')
    res.status(500).send('Non master change, ignore')
  } else {
    // find secret
    var repo = _.find(serverConfig.repos, { full_name: req.body.repository.full_name })
    if (!repo) {
      console.log('Repo not registered')
      res.status(500).send('Repo not registered')
    } else {
      var auth = verifySecret(repo.secret, req)
      if (!auth) {
        console.log('Wrong Secret')
        res.status(500).send('Wrong Secret')
      } else {
        // execute git pull
        updateRepo(repo)
      }
    }
  }
})

app.listen(serverConfig.PORT)

function verifySecret (secret, req) {
  var signature = req.headers['x-hub-signature']
  let payload = JSON.stringify({ hello: 'world' })
  return verifyGithubWebhook(signature, payload, secret)
}

function updateRepo (repo) {
  function puts (error, stdout, stderr) { sys.puts(stdout) }
  exec('cd ' + repo.fullPath + ' && git pull && cd', puts)
  setTimeout(exec('pm2 restart ' + repo.pm2ProcessID, puts), 5000)
}
