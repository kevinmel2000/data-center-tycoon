var num = require('numeric');

function _solve(prices, bases, risks, budget) {

  //
  // \[\vec{x_{n + 1}} = \vec{x_n} - \gamma \vec{p_n}\]
  //
  // where
  //
  // \[Hf(\vec{x}, \lambda)\vec{p_n} = \nambla \vec{x}\]
  // \[f(\vec{x}, \lambda) = \sum_i a_i \frac{1 - {c_i}^{1 - \eta_i}}{1 - \eta_i} + \lambda\left(\sum_i(p_ic_i) - b\right)\]
  //
  // (\(f\) is the Lagrangian of
  //
  // \[\sum_i a_i \frac{1 - {c_i}^{1 - \eta_i}}{1 - \eta_i}\]
  //
  // given
  //
  // \[ \sum_i p_ic_i = b \]
  //
  // and
  //
  // \( n = i + 1 \) (\(\lambda\) adds an extra dimension)
  // \(c_i\) is the consumption of the ith product
  // \(a_i\) is the base utility coefficient
  // \(\eta_i\) is the risk factor in buying the ith product
  // \(p_i\) is the cost of the ith product
  //
  function p(buys) {
    var hf = 
      Array.apply(null, Array(prices.length))
        .map(function (_, i) {
          return risks[i] * (1 - risks[i]) / Math.pow(buys[i], risks[i] + 1);
        })
        .concat(0)
    ;

    hf = num.diag(hf);

    var del = Array.apply(null, Array(prices.length))
      .map(function (_, i) {
        return (bases[i] / Math.pow(buys[i], -risks[i])) +
               (buys[buys.length - 1] * buys[i]);
      })
      .concat(num.dot(prices, buys) - budget)
    ;

    console.log('A:', hf);
    console.log('b:', del);

    return num.solve(hf, del);
  }

  var buys = Array.apply(null, Array(prices.length + 1))
        .map(function () { return 0.1; }),
      delta = buys.map(function () { return 100; }),
      gamma = 1, // Smaller step sizes may perform better, this is empirically adjusted
      epsilon = 0.01; // Use this to adjust precision

  while (num.norm2(delta) > epsilon) {
    delta = p(buys);
    buys = num.sub(buys, delta);
  }

  buys.pop();

  return buys.map(function (b) {
    return Math.max(0, Math.floor(b));
  });
}

module.exports = function solve(params, budget) {
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


