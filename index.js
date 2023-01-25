const authCommand = require('./lib/generate-auth')

module.exports = function (bot, botConfig) {
  // Detect possible login/register failure
  var isCommandSended = false;
  var config = botConfig.AutoAuth;

  if (!bot) {
    throw new Error('Bot object is missing, please provide valid mineflayer bot as first argument');
  }

  if (!config) {
    throw new Error('Password is missing, expecting string or object as second argument');
  }

  if (typeof config === 'string') {
    config = {
      password: config
    };
  } else if (!config.password) {
    throw new Error('Password property missing in second argument');
  }

  bot.addChatPattern('registerRequest', /\/register/);
  bot.addChatPattern('loginRequest', /\/login/);
  bot.addChatPattern("loginSuccess", /Successful login!/);

  function remove() {
    bot.removeChatPattern("registerRequest")
    bot.removeChatPattern("loginRequest")
    bot.removeChatPattern("loginSuccess")
  }

  bot.on('chat:registerRequest', () => {
    bot.chat(authCommand('register', config.password));
    if (config.logging) {
      console.log('Got register request');
    }

    if (isCommandSended) {
      console.log('Register request repeated, probably failed to register');
      if (config.repeatCb) {
        config.repeatCb.call();
      }
    }

    if (!config.ignoreRepeat) {
      isCommandSended = true;
    }
  });

  bot.on('chat:loginRequest', () => {
    bot.chat(authCommand('login', config.password));
    if (config.logging) {
      console.log('Got login request');
    }

    if (isCommandSended) {
      console.log('Login request repeated, probably failed to login');
      if (config.repeatCb) {
        config.repeatCb.call();
      }
    }

    if (!config.ignoreRepeat) {
      isCommandSended = true;
    }
  });

  bot.on("chat:loginSuccess", async () => {
    bot.emit('serverAuth');
    remove()
  })
};
