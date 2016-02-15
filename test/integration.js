var assert = require('assert');
var mineflayer = require('mineflayer');
var mc = require('minecraft-protocol');

var AutoAuth = require('../index');

var bot, server;
describe('Integration', function() {
  beforeEach(function(done) {
    server = mc.createServer({'online-mode': false});
    server.on('listening', function() {
      bot = mineflayer.createBot({
        username: 'Player'
      });

      done();
    });
  });

  afterEach(function(done) {
    bot.on('end', done);
    server.close();
  });

  describe('Event detection', function() {
    beforeEach(function() {
      AutoAuth(bot, 'testpass');
    });

    it('should register on "/register" message', function(done) {
      sendMsg('Register! /register', function(packet) {
        assert.equal(packet.message, '/register testpass testpass');
        done();
      });
    });

    it('should login on "/login" message', function(done) {
      sendMsg('/login command please', function(packet) {
        assert.equal(packet.message, '/login testpass');
        done();
      });
    });

    it('should emit "serverAuth" event after auth request', function(done) {
      bot.on('serverAuth', function() {
        done();
      });
      sendMsg('/login command please');
    });
  });

  describe('Advanced config', function() {
    it('should accept password in object', function(done) {
      AutoAuth(bot, {password: 'mypass'});
      sendMsg('/login command please', function(packet) {
        assert.equal(packet.message, '/login mypass');
        done();
      });
    });

    it('should react on request repeating', function(done) {
      AutoAuth(bot, {password: 'mypass', repeatCb: done});
      sendMsg('/login command please', function(packet) {
        assert.equal(packet.message, '/login mypass');
      });

      sendMsg('/login command please', function(packet) {
        assert.equal(packet.message, '/login mypass');
      });
    });

    it('should suppress request repeating reaction on ignoreRepeat option', function(done) {
      var msgCount = 0;

      AutoAuth(bot, {password: 'mypass', repeatCb: function() {
        done('Called callback for repeat with suppress option');
      }, ignoreRepeat: true});

      sendMsg('/login command please');
      sendMsg('/register command man', function(packet) {
        msgCount++;
        if(msgCount === 2) {
          done();
        }
      });
    });
  });
});

function sendMsg(text, cb) {
  server.on('login', function(client) {
    var message = '{ translate: "chat.type.text", with: ["' + text + '"]}';
    client.write('chat', { message: message });
    if(cb) {
      client.on('chat', cb);
    }
  });
}
