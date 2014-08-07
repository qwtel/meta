var withMasterKey = require('cloud/helper/withMasterKey.js');
var toPlayerView = require('cloud/helper/toPlayerView.js');

var newGame = require('cloud/functions/newGame.js');

function getGame(req) {
  return withMasterKey(function () {
    var user = req.user;
    if (!user) {
      return Parse.Promise.error('Not logged in');
    }

    var resultPromise;
    var currentGame = user.get('currentGame');
    if (currentGame) {
      console.log('Fetch current game');
      resultPromise = currentGame.fetch().then(toPlayerView);
    } else {
      console.log('Create new game');
      resultPromise = newGame(req);
    }
    
    return resultPromise;
  });
}

module.exports = getGame;
