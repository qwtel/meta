var withMasterKey = require('cloud/helper/withMasterKey.js');

var GameState = require('cloud/enum/GameState');

var Game = Parse.Object.extend("Game");

function getHistory(req) {
  return withMasterKey(function () {
    var user = req.user;
    var page = req.params.page || 1;

    var isPlayer1 = new Parse.Query(Game)
      .equalTo('state', GameState.GameOver)
      .equalTo('player1', user);
    
    var isPlayer2 = new Parse.Query(Game)
      .equalTo('state', GameState.GameOver)
      .equalTo('player2', user);

    return Parse.Query.or(isPlayer1, isPlayer2)
      .descending("createdAt")
      .skip(10 * (page - 1))
      .limit(10 * page)
      .find()
  });
}

module.exports = getHistory;

