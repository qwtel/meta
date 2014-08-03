var withMasterKey = require('cloud/helper/withMasterKey.js');
var toPlayerView = require('cloud/helper/toPlayerView.js');

var BotType = require('cloud/enum/BotType.js');
var GameState = require('cloud/enum/GameState.js');

var Bot = Parse.Object.extend("Bot");
var Game = Parse.Object.extend("Game");

function newGame(req) {
  return withMasterKey(function () {
    var user = req.user;
    
    var q = new Parse.Query(Bot);
    q.equalTo('botType', BotType.random());
    return q.first().then(function (bot) {
      var game = new Game();

      var gameSavedPromise = game.save({
        player1: bot,
        player2: user,
        move1: BotType.action(bot.get('botType')),
        move2: undefined,
        state: GameState.SecondMove
      });

      var userUpdatedPromise = gameSavedPromise.then(function (game) {
        return user.save('currentGame', game)
      });

      return userUpdatedPromise.then(function () {
        return toPlayerView(game);
      });
    });
  });
}

module.exports = newGame;
