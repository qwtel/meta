define(function () {
  
  // keep in cache
  var currentGame;

  function GameService() {
  }

  GameService.getGame = function () {
    if (!currentGame) {
      return new Promise(function (res, rej) {
        Parse.Cloud.run("getGame")
          .then(function (game) {
            currentGame = game;
            res(game);
          }, rej);
      });
    } else {
      return Promise.resolve(currentGame);
    }
  };

  GameService.doAction = function (user, action) {
    return new Promise(function (res, rej) {
      GameService.clearCache();
      Parse.Cloud.run('doAction', {
        action: action
      }).then(function (xxx) {
        // TODO: Handle response (next game, notifications?)
        currentGame = res[1];
        user.set('currentGame', currentGame);
        res(xxx);
      }, rej);
    });
  };
  
  GameService.getHistory = function (page) {
    return new Promise(function (res, rej) {
      Parse.Cloud.run('getHistory', {
        page: page
      }).then(function(xxx) {
        res(xxx);
      }, rej);
    });
  };
  
  GameService.clearCache = function() {
    currentGame = undefined;
  };
  
  // TODO: not good
  window.GameService = GameService;

  return GameService
});
