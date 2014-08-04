var Enum = require('cloud/enum/Enum.js');
var Action = require('cloud/enum/Action.js');
var getRandomInt = require('cloud/helper/getRandomInt.js');

var BotType = new Enum({
  Coop: 0,
  Defect: 1,
  Pass: 2,
  Random: 3
}, {
  action: function (botType) {
    switch (botType) {
      case BotType.Coop: return Action.Cooperate;
      case BotType.Defect: return Action.Defect;
      case BotType.Pass: return Action.Pass;
      case BotType.Random: return Action.random();
    }
  },

  random: function () {
    return BotType.values()[getRandomInt(BotType.keys().length)];
  }
});

module.exports = BotType;
