var withMasterKey = require('cloud/helper/withMasterKey.js');

var newGame = require('cloud/functions/newGame.js');

var Action = require('cloud/enum/Action.js');
var GameState = require('cloud/enum/GameState.js');

var GameLogic = require('cloud/logic/GameLogic.js');
var LevelLogic = require('cloud/logic/LevelLogic.js');

function doFirstMove(move1, game) {
  return game.save({
    move1: move1,
    state: GameState.SecondMove
  });
}

function doSecondMove(move2, game) {
  var updatedGamePromise = game.save({
    move2: move2,
    state: GameState.GameOver
  });

  var logic = new GameLogic(game.get('move1'), move2);

  var statSheet1 = game.get('player1').get('statSheet');
  var statSheet2 = game.get('player2').get('statSheet');
  var updatedStats1Promise = updateStatSheet(statSheet1, logic.result1(), game.get('move1'));
  var updatedStats2Promise = updateStatSheet(statSheet2, logic.result2(), move2);

  return Parse.Promise.when(updatedGamePromise, updatedStats1Promise, updatedStats2Promise).then(function () {
    return game;
  });
}

function updateStatSheet(statSheet, result, move) {
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

  return statSheet.save({
    numGames: numGames,
    points: points,
    ppg: points / numGames
    // TODO: score, ranking
  });
}

function doAction(req) {
  return withMasterKey(function () {
    var action = req.params.action;

    // TODO: validate action

    var user = req.user;
    
    // TODO: include only on second move
    var updatedGamePromise = new Parse.Query("Game")
      .include("player1.statSheet")
      .include("player2.statSheet")
      .get(user.get('currentGame').id)
      .then(function (game) {
        switch (game.get('state')) {
          case GameState.FirstMove: return doFirstMove(action, game);
          case GameState.SecondMove: return doSecondMove(action, game);
          case GameState.GameOver: return Parse.Promise.error("Game already over");
        }
      });

    var newGamePromise = newGame(req).then(function (nextGame) {
      return nextGame
    });
    
    return Parse.Promise.when(updatedGamePromise, newGamePromise).then(function(game, newGame) {
      return [game, newGame];
    });
  });
}

module.exports = doAction;
