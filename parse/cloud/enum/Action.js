var Enum = require('cloud/enum/Enum.js');
var getRandomInt = require('cloud/helper/getRandomInt.js');

var Action = new Enum({
  Cooperate: 'cooperate',
  Pass: 'pass',
  Defect: 'defect'
}, {
  random: function () {
    return Action.values()[getRandomInt(Action.keys().length)];
  }
});

module.exports = Action;
