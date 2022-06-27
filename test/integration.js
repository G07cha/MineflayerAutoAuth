var assert = require('assert');
var mineflayer = require('mineflayer');
var mc = require('minecraft-protocol');

var AutoAuth = require('../index');

var server;
describe('Integration', function() {
  beforeEach(function(done) {
    server = mc.createServer({'online-mode': false});
    server.on('listening', done);
  });

  afterEach(function() {
    server.close();
  });

  describe('Event detection', function() {
    var bot;

    beforeEach(function() {
      bot = mineflayer.createBot({
        username: 'Player',
        plugins: {
          AutoAuth
        },
        AutoAuth: 'testpass'
      });
    });
  
    afterEach(function(done) {
      bot.quit();
      bot.on('end', () => done());
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
    var bot;

    afterEach(function(done) {
      bot.quit();
      bot.on('end', () => done());
    });

    it('should react on request repeating', function(done) {
      bot = mineflayer.createBot({
        username: 'Player',
        plugins: [AutoAuth],
        AutoAuth: {
          password: 'testpass',
          repeatCb: () => done()
        }
      });

      sendMsg('/login command please', function(packet) {
        assert.equal(packet.message, '/login testpass');
      });

      sendMsg('/login command please', function(packet) {
        assert.equal(packet.message, '/login testpass');
      });
    });

    it('should suppress request repeating reaction on ignoreRepeat option', function(done) {
      bot = mineflayer.createBot({
        username: 'Player',
        plugins: { AutoAuth },
        AutoAuth: {
          password: 'testpass',
          repeatCb: function() {
            done('Called callback for repeat with suppress option');
          },
          ignoreRepeat: true
        }
      });

      var msgCount = 0;

      sendMsg('/login command please');
      sendMsg('/register command man', function() {
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
    client.write('chat', { message: message, position: 0, sender: '0' });
    if(cb) {
      client.on('chat', cb);
    }
  });
}
