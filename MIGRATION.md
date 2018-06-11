# Migrating from 0.x to 1.x

Instead of passing bot in AutoAuth plugin you instead, need to pass AutoAuth as well as configuration for it in bot's configuration like so:

```javascript
var mineflayer = require('mineflayer');
var AutoAuth = require('mineflayer-auto-auth')
var bot = mineflayer.createBot({
  plugins: [AutoAuth],  // Load AutoAuth plugin
  AutoAuth: {
    // Configuration for AutoAuth plugin
  }
});
```
