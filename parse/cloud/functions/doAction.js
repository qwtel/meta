var withMasterKey = require('cloud/helper/withMasterKey');

var newGame = require('cloud/functions/newGame.js');
var doSecondMove = require('cloud/functions/doSecondMove.js');

var Action = require('cloud/enum/Action');
var GameState = require('cloud/enum/GameState');

function doFirstMove(user, move, game, userNum) {
  game.set('move' + userNum, move);

  var updatedGamePromise = game.save({
    state: GameState.SecondMove
  });

  if (user.get("queuedGames")) {
    user.remove('queuedGames', game);
  }
  var updatedUserPromise = user.save();

  return Parse.Promise.when(updatedGamePromise, updatedUserPromise)
    .then(function (game, user) {
      return [game, user];
    });
}

function doAction(req) {
  return withMasterKey(function () {
    var user = req.user;
    if (!user) {
      return Parse.Promise.error('Not logged in');
    }

    var action = req.params.action;
    if (Action.values().indexOf(action) === -1) {
      return Parse.Promise.error('Invalid action');
    }

    var gameId = req.params.gameId;
    if (!gameId) {
      return Parse.Promise.error('No game id provided');
    }

    var updatedGamePromise = new Parse.Query("Game")
      .include("player1.statSheet")
      .include("player2.statSheet")
      .get(gameId)
      .then(function (game) {

        var userNum;
        if (game.get('player1').id === user.id) {
          userNum = 1;
        } else if (game.get('player2').id === user.id) {
          userNum = 2;
        } else {
          return Parse.Promise.error('You are not part of this game!');
        }
        
        if (game.get('move' + userNum)) {
          return Parse.Promise.error('You have already made your move!');
        }

        switch (game.get('state')) {
          case GameState.FirstMove: return doFirstMove(user, action, game, userNum);
          case GameState.SecondMove: return doSecondMove(user, action, game, userNum);
          case GameState.GameOver: return Parse.Promise.error("Game already over");
        }
      });

    var newGamePromise = newGame(req).then(function (nextGame) {
      return nextGame
    });

    return Parse.Promise.when(updatedGamePromise, newGamePromise).then(function (arr, newGame) {
      var game = arr[0];
      var user = arr[1];
      return [user, game, newGame];
    });
  });
}

module.exports = doAction;
