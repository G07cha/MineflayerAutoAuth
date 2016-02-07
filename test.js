var tap = require('tap');
var generateAuth = require('./lib/generate-auth');

tap.equal(generateAuth('register', 'test'), '/register test test',
'register command should repeat password twice');
tap.equal(generateAuth('login', 'test'), '/login test',
'login command should return password only one time');
