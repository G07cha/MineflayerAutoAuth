# AutoAuth

Minecraft bot auth in servers that don't use `online-mode=true` and require chat authentication. After extending bot will send auth data on `/register` and `/login` messages in chat and emit `serverAuth` event  after that. Extends [mineflayer](https://github.com/PrismarineJS/mineflayer).

[**You can find migration guide from 0.x to 1.x here**](/MIGRATION.md)

## Install

### As dependency

`npm install mineflayer-auto-auth`

Also make sure that `mineflayer` installed locally as well.

### As development version

```
git clone https://github.com/G07cha/MineflayerAutoAuth
npm install
npm test
```

## Usage

Simple example:

```javascript
var mineflayer = require('mineflayer');
var AutoAuth = require('mineflayer-auto-auth')
var bot = mineflayer.createBot({
  plugins: [AutoAuth],
  AutoAuth: 'password'
});

bot.on('serverAuth', function() {
  // Here bot should be already authorized
});
```

Advanced usage(see [API](#api):

```javascript
var mineflayer = require('mineflayer');
var AutoAuth = require('mineflayer-auto-auth')
var bot = mineflayer.createBot({
  plugins: [AutoAuth],
  AutoAuth: {
    logging: true,
    password: 'password',
    ignoreRepeat: true
  }
});

bot.on('serverAuth', function() {
  // Here bot should be already authorized
});
```

## API

- AutoAuth as string is shorthand for `AutoAuth: { password: 'yourpassword' }`

### `AutoAuth` object

- password(required)
- logging(default: false) - additional logging for easier debug
- ignoreRepeat(default: false) - ignore repeating login/register requests, by default will log about repeating
- repeatCb(function) - callback called on request repeating

## License

MIT © [Konstantin Azizov](http://g07cha.github.io)
