var noweb = require('./noweb');

noweb.tangle('./solver', function (err, solver) {
  if (err) {
    throw err;
  }

  console.log(solver({
    shoes: {
      price: 200,
      base: 10,
      risk: 1.1
    },
    watermelons: {
      price: 100,
      base: 8,
      risk: 1.3
    }
  }, 1000));
});
