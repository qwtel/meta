var withMasterKey = require('cloud/helper/withMasterKey.js');
var toPlayerView = require('cloud/helper/toPlayerView.js');

var getRandomInt = require('cloud/helper/getRandomInt.js');

var GameState = require('cloud/enum/GameState.js');

var Bot = Parse.Object.extend("Bot");
var Game = Parse.Object.extend("Game");

function queuedGame(user) {
  var queuedGameIds = user.get('queuedGames');

  // TODO: send multiple games
  return new Parse.Query(Game)
    .containedIn('objectId', queuedGameIds)
    .include('player1')
    .include('player2')
    .select(['player1', 'player2', 'state'])
    //.limit(10)
    .descending("createdAt")
    .first();
}

function createNewGame(user) {
  
  // TODO: send multiple games
  return selectRandomEnemies(user)
    .then(function (enemies) {
      // TODO: send multiple games
      var n = enemies.length;
      var i = getRandomInt(n);
      return enemies[i];
    }).then(function (enemy) {
      var game = new Game();

      var gameSavedPromise = game.save({
        player1: user,
        player2: enemy,
        move1: undefined,
        move2: undefined,
        state: GameState.FirstMove
      });

      var userUpdatedPromise = gameSavedPromise.then(function (game) {
        var p1 = user.save('currentGame', game);
        var p2 = enemy.add('queuedGames', game);
        return Parse.Promise.when(p1, p2);
      });
      
      return userUpdatedPromise.then(function (user) {
        // TODO: return user
        return game;
      });
    });
}

function selectRandomEnemies(user) {
  return new Parse.Query(Parse.User)
    .include('statSheet')
    .notEqualTo('objectId', user.id)
    .descending('updatedAt')
    .limit(10)
    .find()
}

function newGame(req) {
  return withMasterKey(function () {
    var user = req.user;
    if (!user) {
      return Parse.Promise.error('Not logged in');
    }

    if (user.get('queuedGames') && user.get('queuedGames').length > 0) {
      return queuedGame(user);
    } else {
      return createNewGame(user);
    }
  });
}

/**
 * @Deprecated
 */
function bot() {
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
}

module.exports = newGame;
