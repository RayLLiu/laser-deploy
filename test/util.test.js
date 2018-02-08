/* global , it, describe */
var Util = require('../services/util.js')
var assert = require('assert')
var crypto = require('crypto')
describe('Util Test', function () {
  var test = new Util()
  describe('verifySecret', function () {
    it('should return true when secret is correct', function () {
      var payload = {test: 1}
      var signature = 'sha1=' + crypto.createHmac('sha1', 'test').update(JSON.stringify(payload)).digest('hex')
      var result = test.verifySecret('test', {headers: {'x-hub-signature': signature}, body: payload})
      assert.equal(result, true)
    })
    it('should return false when secret is correct', function () {
      var payload = {test: 1}
      var signature = 'sha1=' + crypto.createHmac('sha1', 'wrong').update(JSON.stringify(payload)).digest('hex')
      var result = test.verifySecret('test', {headers: {'x-hub-signature': signature}, body: payload})
      assert.equal(result, false)
    })
  })
})
