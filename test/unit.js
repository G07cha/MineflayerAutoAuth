var assert = require('assert');
var generateAuth = require('../lib/generate-auth');

describe('Unit', function() {
  describe('Auth generation', function() {
    it('should generate register command with password repeating', function() {
      assert.equal(generateAuth('register', 'test'), '/register test test');
    });

    it('should generate login command with single password', function() {
      assert.equal(generateAuth('login', 'test'), '/login test');
    });
  });
});
