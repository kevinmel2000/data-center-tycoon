#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    bashful = require('bashful'),
    through = require('through'),
    duplex = require('duplexer'),
    read = require('read');

require('colors');

// So I can hook this into something else later if need be
var log = console.log;

var mainframe = module.exports = function (options, onCmd) {
  options = options || {};

  log(require('./splash'));

  function prompt(callback) {
    log();
    log('TIME TO LOG IN!'.bold);
    log();
    read({
      prompt: 'username:'
    }, function (err, username) {
      if (err) return callback(err);

      if (username.length === 0) {
        log('Whoa buddy, that\'s a zero length username');
        log('That is ' + 'not'.bold + ' legit. Try again.');
        return prompt(callback);
      }

      if (available(username)) {
        return createAccount(username, function (err, created) {
          if (err) return callback(err);
          prompt(callback);
        });
      }

      read({
        prompt: 'password:',
        silent: true
      }, function (err, password) {
        if (err) return callback(err);
        callback(null, { username: username, password: password });
      });
    });
  }

  prompt(function _self(err, creds) {
    log();

    if (err) throw err;
    if (verify(creds)) {
      var bash, b;

      log('[ ☺ ACCESS GRANTED ☺ ]'.green.bold);
      log();

      log('Welcome to the ' + 'datacenter'.rainbow.bold + '!');
      log('If you\'re confused, type ' + '\'help\''.cyan + '!');
      log('');

      bash = bashful({
        PWD: '/home/' + creds.username,
        USER: creds.username,
        PS1: creds.username + '@datacenter$ ',
        PATH: path.resolve(__dirname, 'commands') + ':' + process.env.PATH
      });

      bash.on('command', onCmd);

      var b = bash.createStream();
      process.stdin.pipe(b, { end: false }).pipe(process.stdout, { end: false });
      b.on('end', function () {
        prompt(_self);
      });
    }
    else {
      log();
      log('[ ☠ ACCESS DENIED ☠ ]'.red.bold);
      log();
      prompt(_self);
    }
  });
}

function verify(creds) {
  return true;
}

function available(username) {
  return false;
}

function createAccount(username, callback) {
  _self();
  function _self() {
    log();
    log('User ' + username.cyan + ' does ' + 'not exist'.red.bold + ' but is ' + 'available'.green.bold + '!');
    read({
      prompt: 'Would you like to create this account? [y/N]'
    }, function (err, ans) {
      if (err) return callback(err);
      log();
      if (ans.toLowerCase() === 'y' || ans.toLowerCase() === 'yes') {
        read({
          prompt: 'What password would you like?',
          silent: true
        }, function (err, first) {
          if (err) return callback(err);
          if (first.length === 0) {
            log('A ' + 'zero length'.red + ' password???');
            log('That\'s a ' + 'terrible idea'.bold + '. Try again.');
            return _self();
          }
          read({
            prompt: 'Type it in again (to confirm):',
            silent: true
          }, function (err, second) {
            if (err) return callback(err);
            if (first === second) {
              log();
              log('CREATING NEW ACCOUNT...'.rainbow.bold);
              log('DONE.'.bold);
              callback(null, true);
            }
            else {
              log('Passwords don\'t match.');
              _self();
            }
          });
        });
      }
      else {
        callback(null, false);        
      }
    });
  }
}
