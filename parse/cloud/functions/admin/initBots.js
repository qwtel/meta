var BotType = require('cloud/enum/BotType.js');

var whenAdmin = require('cloud/helper/whenAdmin.js');
var withMasterKey = require('cloud/helper/withMasterKey.js');

var Bot = Parse.Object.extend("Bot");

function createBot(botType, firstName, about) {
  var bot = new Bot();

  return bot.save({
    botType: botType,
    firstName: firstName,
    about: about
  });
}

function initBots(req) {
  return whenAdmin(req)(function () {
    return withMasterKey(function () {

      var botsData = [
        [BotType.Coop, 'Coop Bot', 'I always cooperate'],
        [BotType.Defect, 'Defect Bot', 'I always defect'],
        [BotType.Pass, 'Escape Bot', 'I always escape'],
        [BotType.Random, 'Random Bot', "I have no idea what I'm doing"]
      ];

      var promises = botsData.map(function (botData) {
        return createBot.apply(undefined, botData);
      });

      return Parse.Promise.when(promises);
    });
  });
}

module.exports = initBots;
