var duplex = require('duplex');

module.exports = function (options) {
  var io = duplex(read, write);

};
