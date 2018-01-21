var serverConfig = require('./config.js').serverConfig
var deployAPIendpoint = serverConfig.deployAPIendpoint
var express = require('express')
const bodyParser = require('body-parser')
var _ = require('lodash')
var exec = require('child_process').exec
var crypto = require('crypto')
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
  let payload = JSON.stringify(req.body)
  return verifyGithubWebhook(signature, payload, secret)
}
function puts (error, stdout, stderr) {
  if (error) {
    console.log(error)
  }
  console.log(stdout)
}
function updateRepo (repo) {
  exec('cd ' + repo.fullPath + ' && git pull && yarn install && cd', puts)
  if (repo.restartService) {
    setTimeout(function () { restartPM2process(repo.pm2ProcessID) }, 5000)
  }
}

function restartPM2process (id) {
  exec('pm2 restart ' + id, puts)
}

function verifyGithubWebhook (signature, payload, secret) {
  const computedSignature = `sha1=${crypto.createHmac('sha1', secret).update(payload).digest('hex')}`
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))
}
