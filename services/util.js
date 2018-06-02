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
    var bash = 'cd ' + repo.fullPath + ' && git pull && yarn install'
    if (repo.restartService) {
      bash = bash + ' && pm2 restart ' + repo.pm2ProcessID
      exec(bash)
    } else {
      exec(bash)
    }
  }

  // TODO: instead of static bash script, run bash files here.
  restartPM2process (id) {
    exec('pm2 restart ' + id, this.puts)
  }

  verifySecret (secret, req) {
    const computedSignature = `sha1=${crypto.createHmac('sha1', secret).update(JSON.stringify(req.body)).digest('hex')}`
    return crypto.timingSafeEqual(Buffer.from(req.headers['x-hub-signature']), Buffer.from(computedSignature))
  }
}
module.exports = Util
