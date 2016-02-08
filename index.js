var authCommand = require('./lib/generate-auth');

module.exports = function(bot, config) {
  if(!bot) {
    throw new Error('Bot object is missing, please provide valid mineflayer bot as first argument');
  }

  if(!config) {
    throw new Error('Password is missing, expecting string or object as second argument');
  }

  if(typeof config === 'string') {
    config = {
      password: config
    };
  } else if (!config.password) {
    throw new Error('Password property missing in second argument');
  }

  bot.chatAddPattern(/\/register/, 'registerRequest', 'Registration request from server');
  bot.chatAddPattern(/\/login/, 'loginRequest', 'Login request from server');

  bot.on('registerRequest', function() {
    bot.chat(authCommand('register', config.password));
    if(config.logging) {
      console.log('Got register request');
    }
  });
  bot.on('loginRequest', function() {
    bot.chat(authCommand('login', config.password));
    if(config.logging) {
      console.log('Got login request');
    }
  });
};
