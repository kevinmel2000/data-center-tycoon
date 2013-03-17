var num = require('numeric');

function _solve(prices, bases, risks, budget) {

  var n = prices.length;

  function p(buys) {
    //
    // Note that in the woven code, prices, bases, buys, risks and budget
    // will all be defined.
    //
    function dLdci(i) {
      return prices[i] - bases[i] * Math.pow(buys[i], risks[i]);
    }
    function dLdl() {
      var sum = 0;
      for (i = 0; i < n; i++) {
        sum += prices[i] * buys[i];
      }
      return sum - budget;
    }
    function d2Ldci2(i) {
      return - bases[i] * risks[i] * Math.pow(buys[i], risks[i] - 1);
    }
    function d2Ldcidl() {
      var sum = 0;
      for (i = 0; i < n; i++) {
        sum += prices[i];
      }
      return sum;
    }

    var hf = Array.apply(null, Array(n))
      .map(function (_, i) {
        return Array.apply(null, Array(n))
          .map(function (_, j) {
            if (i == j) {
              return d2Ldci2(i);
            }
            else {
              return 0;
            }
          })
          .concat(d2Ldcidl())
        ;
      })
      .concat([
        Array.apply(null, Array(prices.length))
          .map(function (_, i) {
            return d2Ldcidl(i);
          })
          .concat(0)
      ])
    ;

    var del = Array.apply(null, Array(n))
      .map(function (_, i) {
        return dLdci(i);
      })
      .concat(dLdl())
    ;

    return num.solve(hf, del);
  }

  var buys = Array.apply(null, Array(n + 1))
        .map(function () { return 100; }),
      delta = buys.map(function () { return 100; }),
      gamma = 1, // Smaller step sizes may perform better, this is empirically adjusted
      epsilon = 0.01, // Use this to adjust precision
      next;

  while (num.norm2(delta) > epsilon) {
    next = num.sub(buys, p(buys));
    delta = buys - next;
    buys = next;
  }

  buys.pop();

  return buys.map(function (b) {
    return Math.max(0, Math.floor(b));
  });
}

module.exports = function (params, budget) {
  var keys = Object.keys(params),
      prices = [],
      bases = [],
      risks = [],
      buys = {};

  keys.forEach(function (k) {
    prices.push(params[k].price);
    bases.push(params[k].base);
    risks.push(params[k].risk);
  });

  _solve(prices, bases, risks, budget).forEach(function (b, i) {
    buys[keys[i]] = b;
  });

  return buys;
};
