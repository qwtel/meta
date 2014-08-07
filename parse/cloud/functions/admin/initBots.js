var BotType = require('cloud/enum/BotType.js');

var whenAdmin = require('cloud/helper/whenAdmin.js');
var withMasterKey = require('cloud/helper/withMasterKey.js');

function createBot(botType, firstName, about, pictureUrl) {
  var bot = new Parse.User();

  return bot.save({
    username: BotType.keys()[botType] + 'Bot',
    password: Math.random().toString(36).substring(7),
    email: BotType.keys()[botType] + "Bot@meta.parseapp.com",
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
        [BotType.Coop, 'Coop Bot', 'I always cooperate', '//i.imgur.com/BoAzl1d.jpg'],
        [BotType.Defect, 'Defect Bot', 'I always defect', '//i.imgur.com/33K5sLb.jpg'],
        [BotType.Pass, 'Escape Bot', 'I always escape', '//i.imgur.com/rmm1m4k.jpg'],
        [BotType.Random, 'Random Bot', "I have no idea what I'm doing", '//i.imgur.com/BXQD1an.jpg']
      ];

      var promises = botsData.map(function (botData) {
        return createBot.apply(undefined, botData);
      });

      return Parse.Promise.when(promises);
    });
  });
}

module.exports = initBots;
