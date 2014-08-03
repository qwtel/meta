var withMasterKey = require('cloud/helper/withMasterKey.js');
var toPlayerView = require('cloud/helper/toPlayerView.js');

var newGame = require('cloud/functions/newGame.js');

function getGame(req) {
  return withMasterKey(function () {
    var user = req.user;

    var resultPromise;
    var currentGame = user.get('currentGame');
    if (currentGame) {
      resultPromise = currentGame.fetch().then(toPlayerView);
    } else {
      resultPromise = newGame(req);
    }
    
    return resultPromise;
  });
}

module.exports = getGame;
