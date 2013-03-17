var spawn = require('child_process').spawn,
    fs = require('fs'),
    path = require('path');

exports.tangle = function tangle(req, opts, cb) {
  if (!cb && typeof opts == 'function') {
    cb = opts;
    opts = {};
  }

  var nwOpts = opts.noweb || [],
      stderr = opts.stderr || process.stderr;

  var read = path.resolve(__dirname, req) + '.nw',
      write = path.resolve(__dirname, req) + '.js';

  var nw = spawn('notangle', nwOpts.concat(read));

  nw.stdout.pipe(fs.createWriteStream(write));
  nw.stderr.pipe(stderr);

  var code, i = 0;

  nw.on('exit', function (c) {
    code = c;
    i++;
    finish();
  });

  nw.stdout.on('end', function () {
    i++;
    finish();
  });

  nw.stderr.on('end', function () {
    i++;
    finish();
  });

  function finish() {
    if (i >= 3) {
      if (code) {
        return cb(new Error('noweb returned code ' + code));
      }

      cb(null, require(req));
    }
  };
};
