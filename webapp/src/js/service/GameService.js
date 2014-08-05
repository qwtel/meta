define([
  'logic/GameLogic',
  'logic/LevelLogic'
], function (GameLogic, LevelLogic) {
  
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
        
        var lastGame = xxx[0];
        currentGame = xxx[1];

        var logic = new GameLogic(lastGame.get('move1'), lastGame.get('move2'));
        var statSheet = user.get('statSheet');
        
        statSheet.set({
          level: LevelLogic.isLevelUp(statSheet.get('points') + logic.result2(), statSheet.get('level')) ? statSheet.get('level') + 1 : statSheet.get('level'),
          points: statSheet.get('points') + logic.result2()
        });
        
        user.set({
          currentGame: currentGame
        });
        
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
