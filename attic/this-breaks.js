var fs = require('fs'),
    through = require('through'),
    duplex = require('duplexer'),
    read = require('read');

var stdin = through(),
    stdout = through();

process.stdin.pipe(stdin);
process.stdin.resume();

read({
  prompt: 'username:',
  input: stdin,
  output: process.stdout
}, function (err, username) {
  if (err) throw err;

  read({
    prompt: 'password:',
    input: stdin,
    output: process.stdout
  }, function (err, password) {
    if (err) throw err;
    console.log('un:', username);
    console.log('pw:', password);
  });
});
