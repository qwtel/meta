var BotType = require('cloud/enum/BotType.js');
var GameLogic = require('cloud/logic/GameLogic.js');

var getRandomInt = require('cloud/func/getRandomInt.js');

var StatSheet = Parse.Object.extend("StatSheet");
var Bot = Parse.Object.extend("Bot");
var Game = Parse.Object.extend("Game");

function whenAdmin(req, res) {
  return function (f) {
    if (req.user.get('authData').facebook.id == '10202226173755916') {
      return f();
    } else {
      res.error("Get out of my backyard!");
    }
  }
}

function withMasterKey(f) {
  Parse.Cloud.useMasterKey();
  return f();
  // TODO: Un-use master key
}

Parse.Cloud.beforeSave(Parse.User, function (req, res) {
  var user = req.object;

  function validate(key, limit) {
    var value = user.get(key);
    if (!value || value.trim().length === 0) {
      res.error(key + ' missing');
    } else if (value.trim().length > limit) {
      user.set(key, value.trim().substring(0, (limit - 1)) + '...');
    }
  }

  validate('firstName', 30);
  validate('about', 240);

  res.success();
});

Parse.Cloud.afterSave(Parse.User, function (req, res) {
  var user = req.object;

  if (!user.get('statSheet')) {
    console.log("New user, creating StatSheet");

    withMasterKey(function () {

      var statSheet = new StatSheet();
      statSheet.set({
        user: user,
        level: 1,
        points: 0,
        ppg: 0,
        score: 0,
        rank: 0,
        num: {
          games: 0,
          coop: 0,
          pass: 0,
          defect: 0
        }
      });

      statSheet.save()
        .then(function () {
          user.set('statSheet', statSheet);
          return user.save();
        }, function (error) {
          console.log('Something when wrong with saving the statSheet', error);
          res.error(error);
        })
        .then(function () {
          res.success();
        }, function (error) {
          console.log('Something when wrong with saving the user', error);
          res.error(error);
        });
    });
  }
});

Parse.Cloud.define("initBots", function (req, res) {
  whenAdmin(req, res)(function () {
    withMasterKey(function () {
      function createBot(botType, firstName, about) {
        var bot = new Bot();

        return bot.save({
          botType: botType,
          firstName: firstName,
          about: about
        });
      }
      
      var botsData = [
        [BotType.Coop, 'Coop Bot', 'I always cooperate'],
        [BotType.Defect, 'Defect Bot', 'I always defect'],
        [BotType.Pass, 'Escape Bot', 'I always escape'],
        [BotType.Random, 'Random Bot', "I have no idea what I'm doing"]
      ];
      
      var promises = botsData.map(function (botData) {
        return createBot(botData[0], botData[1], botData[2]);
      });
      
      Parse.Promise.when(promises).then(res.success, res.error);
    });
  });
});

Parse.Cloud.define("getGame", function (req, res) {
  withMasterKey(function () {
    var user = req.user;

    var index = getRandomInt(Object.keys(BotType).length);

    var q = new Parse.Query(Bot);
    q.equalTo('botType', index);
    q.first().then(function (bot) {
      
      if (!bot) /* WTF!??? */ res.error("found bot but didn't find bot");
      
      var game = new Game();

      game.save({
        player1: user,
        player2: bot,
        move1: undefined,
        move2: BotType.action(bot),
        isPending: true,
        isGameOver: false
      })
        .then(function () {
          var ret = game.toJSON();
          delete ret.move2;
          res.success(ret);
        }, res.error);
    });
  });
});

Parse.Cloud.define('doAction', function (req, res) {
  withMasterKey(function () {
    var user = req.user;
    var game = req.params.game;
    var action = req.params.action;

    if (!user || !game || !action) throw new Error();
    
    var logic = new GameLogic(null, null);

  });
});
