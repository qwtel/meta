var getRandomInt = require('cloud/helper/getRandomInt.js');

var Action = Object.freeze({
  Cooperate: 'cooperate',
  Pass: 'pass',
  Defect: 'defect',
  random: function () {
    // TODO: Don't do fucking shit like that
    return ['cooperate', 'pass', 'defect'][getRandomInt(3)];
  }
});

module.exports = Action;
