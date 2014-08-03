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
  
  function getStatSheet(player) {
    return player.get('statSheet').fetch();
  }

  var stats1Promise = game.get('player1').fetch().then(getStatSheet);
  var stats2Promise = game.get('player2').fetch().then(getStatSheet);

  return Parse.Promise.when(stats1Promise, stats2Promise).then(function (p1Stats, p2Stats) {
    var logic = new GameLogic(game.get('move1'), move2);
    var updatedStats1Promise = updateStatSheet(p1Stats, logic.result1(), game.get('move1'));
    var updatedStats2Promise = updateStatSheet(p2Stats, logic.result2(), move2);

    return Parse.Promise.when(updatedGamePromise, updatedStats1Promise, updatedStats2Promise).then(function () {
      return game;
    });
  });
}

function updateStatSheet(statSheet, result, move) {
  var stats = statSheet.toJSON();

  function add(name, by) {
    var v = stats[name] + by;
    statSheet.set(name, v);
    return v;
  }

  function inc(name, by) {
    return add(name, 1)
  }

  switch (move) {
    case Action.Cooperate:
      inc('numCoop');
      break;
    case Action.Pass:
      inc('numPass');
      break;
    case Action.Defect:
      inc('numDefect');
      break;
  }

  var points = add('points', result);
  var numGames = inc('numGames');

  if (points >= LevelLogic.nextLevel(stats.level)) {
    inc('level');
  }

  return statSheet.save({
    numGames: numGames,
    points: points,
    ppg: points / numGames
  });
}

function updateStats(move2, game) {
}

function doAction(req) {
  return withMasterKey(function () {
    var action = req.params.action;

    // TODO: validate action

    var user = req.user;

    return user.get('currentGame').fetch()
      .then(function (game) {
        switch (game.get('state')) {
          case GameState.FirstMove: return doFirstMove(action, game);
          case GameState.SecondMove: return doSecondMove(action, game);
          case GameState.GameOver: return Parse.Promise.error("Game already over");
        }
      })
      .then(function (game) {
        return newGame(req).then(function (nextGame) {
          return [game, nextGame]
        });
      });
  });
}

module.exports = doAction;
