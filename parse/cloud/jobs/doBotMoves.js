var withMasterKey = require('cloud/helper/withMasterKey');

var Action = require('cloud/enum/Action');
var GameState = require('cloud/enum/GameState');

var doSecondMove = require('cloud/functions/doSecondMove');

function doBotMoves(req, status) {
  return withMasterKey(function () {
    var c = 0;
    return new Parse.Query("Game")
      .exists('move1')
      .doesNotExist('move2')
      .include("player1.statSheet")
      .include("player2.statSheet")
      .find()
      .then(function (unfinishedGames) {
        var promises = unfinishedGames.map(function (game) {
          switch (game.get('player2').get('username')) {
            case 'CoopBot':
              c++;
              return doSecondMove(game.get('player2'), Action.Cooperate, game, 2);
            case 'PassBot':
              c++;
              return doSecondMove(game.get('player2'), Action.Pass, game, 2);
            case 'DefectBot':
              c++;
              return doSecondMove(game.get('player2'), Action.Defect, game, 2);
            case 'RandomBot':
              c++;
              return doSecondMove(game.get('player2'), Action.random(), game, 2);
            default:
              return Parse.Promise.as(true)
          }
        });
        return Parse.Promise.when(promises);
      })
      .then(function () {
        status.success('Did ' + c + ' bot moves');
      }, function (error) {
        status.error('Something went wrong');
        logError(error);
      });
  });
}

// duplicate in calculateRankBounds
function logError(error) {
  function helper(error) {
    if (error.message) {
      error = error.message;
    }
    console.error(error);
  }

  if (error.length) error.forEach(helper);
  else helper(error);
}

module.exports = doBotMoves;
