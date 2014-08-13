var Action = require('cloud/enum/Action');
var GameState = require('cloud/enum/GameState');

var GameLogic = require('cloud/logic/GameLogic');
var LevelLogic = require('cloud/logic/LevelLogic');

function doSecondMove(user, move, game, userNum) {
  game.set('move' + userNum, move);
  var updatedGamePromise = game.save({
    state: GameState.GameOver
  });

  var player1 = game.get('player1');
  var player2 = game.get('player2');

  var move1 = userNum === 1 ? move : game.get('move1');
  var move2 = userNum === 2 ? move : game.get('move2');

  var logic = new GameLogic(move1, move2);
  
  function updatePlayer(player, result, move) {
    console.log(player);

    var statSheetPromise = updateStats(player.get('statSheet'), result, move);

    if (player.get("queuedGames")) {
      player.remove('queuedGames', game);
    }

    if (player.id !== user.id) {
      if (!player.get('numNotifications')) {
        player.set('numNotifications', 0);
      }
      player.increment('numNotifications', 1);
      //user.increment('numNotifications', 1);
    }

    return Parse.Promise.when(player.save(), statSheetPromise);
  }

  var updatedPlayer1Promise = updatePlayer(player1, logic.result1(), move1);
  var updatedPlayer2Promise = updatePlayer(player2, logic.result2(), move2);

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

  var obj = {
    numGames: numGames,
    points: points,
    ppg: points / numGames
  };

  //console.log(obj);

  return statSheet.save(obj);
}

module.exports = doSecondMove;
