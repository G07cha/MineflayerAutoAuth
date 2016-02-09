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
      AutoAuth(bot, 'testpass');
      done();
    });
  });

  afterEach(function(done) {
    bot.on('end', done);
    server.close();
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
});

function sendMsg(text, cb) {
  server.on('login', function(client) {
    var message = '{ translate: "chat.type.text", with: ["' + text + '"]}';
    client.write('chat', { message: message, position: 0 });
    client.on('chat', function(packet) {
      cb(packet);
    });
  });
}
