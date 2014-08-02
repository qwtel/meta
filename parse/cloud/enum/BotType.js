var Action = require('cloud/enum/Action.js');
var getRandomInt = require('cloud/func/getRandomInt.js');

var BotType = Object.freeze({
  Coop: 0,
  Defect: 1,
  Pass: 2,
  Random: 3,
  
  // TODO: Move logic somewhere else
  action: function (bot) {
    switch (bot.get('botType')) {
      case 0:
        return Action.Cooperate;
      case 1:
        return Action.Defect;
      case 2:
        return Action.Pass;
      case 3:
        return Action[Object.keys(Action)[getRandomInt(3)]];
    }
  }
});

module.exports = BotType;
