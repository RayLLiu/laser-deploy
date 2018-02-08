var exec = require('child_process').exec
var crypto = require('crypto')
class Util {
  puts (error, stdout, stderr) {
    if (error) {
      console.log(error)
    }
    console.log(stdout)
  }
  updateRepo (repo) {
    exec('cd ' + repo.fullPath + ' && git pull && yarn install && cd', this.puts)
    if (repo.restartService) {
      setTimeout(function () { this.restartPM2process(repo.pm2ProcessID) }, 5000)
    }
  }

  restartPM2processfunction (id) {
    exec('pm2 restart ' + id, this.puts)
  }

  verifySecret (secret, req) {
    const computedSignature = `sha1=${crypto.createHmac('sha1', secret).update(JSON.stringify(req.body)).digest('hex')}`
    return crypto.timingSafeEqual(Buffer.from(req.headers['x-hub-signature']), Buffer.from(computedSignature))
  }
}
module.exports = Util