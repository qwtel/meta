var Action = require('cloud/enum/Action.js');
var getRandomInt = require('cloud/helper/getRandomInt.js');

var BotType = Object.freeze({
  Coop: 0,
  Defect: 1,
  Pass: 2,
  Random: 3,

  // TODO: Move logic somewhere else
  action: function (botType) {
    switch (botType) {
      case BotType.Coop:
        return Action.Cooperate;
      case BotType.Defect:
        return Action.Defect;
      case BotType.Pass:
        return Action.Pass;
      case BotType.Random:
        return Action[Object.keys(Action)[getRandomInt(3)]];
    }
  }
});

module.exports = BotType;
