var withMasterKey = require('cloud/helper/withMasterKey.js');
var getRandomInt = require('cloud/helper/getRandomInt.js');

var BotType = require('cloud/enum/BotType.js');

var Bot = Parse.Object.extend("Bot");
var Game = Parse.Object.extend("Game");

function getGame(req, res) {
  return withMasterKey(function () {
    var user = req.user;

    var currentGame = user.get('currentGame');
    if (currentGame) {
      currentGame.fetch().then(function (game) {
        res.success(toHiddenGame(game));
      });
    }
    else {
      var index = getRandomInt(Object.keys(BotType).length);

      var q = new Parse.Query(Bot);
      q.equalTo('botType', index);
      q.first().then(function (bot) {

        // TODO: /* WTF!??? */
        if (!bot) res.error("found bot but didn't find bot");

        var game = new Game();

        game.save({
          player1: user,
          player2: bot,
          move1: undefined,
          move2: BotType.action(bot.get('botType')),
          isPending: true,
          isGameOver: false
        })
          .then(function (game) {
            return user.save('currentGame', game)
          })
          .then(function () {
            res.success(toHiddenGame(game));
          }, res.error);
      });
    }
  });

  function toHiddenGame(game) {
    // TODO: find enemy
    return {
      enemy: game.get('player2'),
      state: {
        gameId: game.id,
        isPending: game.get('isPending'),
        isGameOver: game.get('isGameOver')
      }
    }
  }
}

module.exports = getGame;
