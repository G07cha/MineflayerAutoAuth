module.exports = (type, password) => {
  let command = '/' + type + ' ' + password;

  if(type === 'register') {
    command += ' ' + password;
  }

  return command;
};
