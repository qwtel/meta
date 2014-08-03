var BotType = require('cloud/enum/BotType.js');

var whenAdmin = require('cloud/helper/whenAdmin.js');
var withMasterKey = require('cloud/helper/withMasterKey.js');

var Bot = Parse.Object.extend("Bot");

function createBot(botType, firstName, about, pictureUrl) {
  var bot = new Bot();

  return bot.save({
    botType: botType,
    firstName: firstName,
    about: about,
    pictureUrl: pictureUrl
  });
}

function initBots(req) {
  return whenAdmin(req)(function () {
    return withMasterKey(function () {

      var botsData = [
        [BotType.Coop, 'Coop Bot', 'I always cooperate', 'images/coop.jpg'],
        [BotType.Defect, 'Defect Bot', 'I always defect', 'images/defect.jpg'],
        [BotType.Pass, 'Escape Bot', 'I always escape', 'images/escape.jpg'],
        [BotType.Random, 'Random Bot', "I have no idea what I'm doing", 'images/random.jpg']
      ];

      var promises = botsData.map(function (botData) {
        return createBot.apply(undefined, botData);
      });

      return Parse.Promise.when(promises);
    });
  });
}

module.exports = initBots;