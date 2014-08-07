var withMasterKey = require('cloud/helper/withMasterKey.js');

var newGame = require('cloud/functions/newGame.js');

var Action = require('cloud/enum/Action.js');
var GameState = require('cloud/enum/GameState.js');

var GameLogic = require('cloud/logic/GameLogic.js');
var LevelLogic = require('cloud/logic/LevelLogic.js');

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

function doSecondMove(user, move, game, userNum) {
  game.set('move' + userNum, move);
  var updatedGamePromise = game.save({
    state: GameState.GameOver
  });

  var player1 = userNum === 1 ? user : game.get('player1');
  var player2 = userNum === 2 ? user : game.get('player2');
  var move1 = userNum === 1 ? move : game.get('move1');
  var move2 = userNum === 2 ? move : game.get('move2');

  var logic = new GameLogic(move1, move2);

  var updatedPlayer1Promise = updatePlayer(player1, game, logic.result1(), move1);
  var updatedPlayer2Promise = updatePlayer(player2, game, logic.result2(), move2);

  return Parse.Promise.when(updatedPlayer1Promise, updatedPlayer2Promise, updatedGamePromise)
    .then(function (player1, player2, game) {
      return [game, (player1.id === user.id ? player1 : player2)];
    });
}

function updateStats(statSheet, result, move) {
  var stats = statSheet.toJSON();

  function add(name, by) {
    var v = stats[name] + by;
    statSheet.set(name, v);
    return v;
  }

  function inc(name) {
    return add(name, 1)
  }

  switch (move) {
    case Action.Cooperate: inc('numCoop'); break;
    case Action.Pass: inc('numPass'); break;
    case Action.Defect: inc('numDefect'); break;
  }

  var points = add('points', result);
  var numGames = inc('numGames');

  if (LevelLogic.isLevelUp(points, stats.level)) {
    inc('level');
  }

  // TODO: score, ranking

  return statSheet.set({
    numGames: numGames,
    points: points,
    ppg: points / numGames
  });
}

function updatePlayer(player, game, result, move) {
  var statSheet = updateStats(player.get('statSheet'), result, move);
  player.set('statSheet', statSheet);
  if (player.get("queuedGames")) {
    player.remove('queuedGames', game);
  }
  return player.save();
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
