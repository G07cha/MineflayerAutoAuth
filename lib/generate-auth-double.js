module.exports = function(type, password) {
  var command = '/' + type + ' ' + password;

  if(type === 'register') {
    command += ' ' + password + ' ' + password;
  }

  return command;
};
