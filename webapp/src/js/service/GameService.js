define([
  'logic/GameLogic',
  'logic/LevelLogic',
  'enum/GameState'
], function (GameLogic, LevelLogic, GameState) {
  
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

  GameService.doAction = function (user, game, action) {
    return new Promise(function (res, rej) {
      GameService.clearCache();
      Parse.Cloud.run('doAction', {
        action: action,
        gameId: game.id
      }).then(function (xxx) {
        // TODO: Message objects (s.js?)
        // TODO: Handle response (next game, notifications?)
        
        var newUser = xxx[0];
        user.set(newUser.attributes);
        
        var lastGame = xxx[1];
        currentGame = xxx[2];

        if (lastGame.get('state') === GameState.GameOver) {
          /*
          // TODO: What is this?
          try {
            var logic = new GameLogic(lastGame.get('move1'), lastGame.get('move2'));
          } catch (e) {
            rej(e);
          }
          var statSheet = user.get('statSheet');

          statSheet.set({
            level: LevelLogic.isLevelUp(statSheet.get('points') + logic.result2(), statSheet.get('level')) ? statSheet.get('level') + 1 : statSheet.get('level'),
            points: statSheet.get('points') + logic.result2()
          });
          */
        }
        
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
