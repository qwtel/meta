define([
  'promise',
  'parse'
], function (Promise, Parse) {
  function GameService() {
  }

  GameService.getGame = function () {
    return new Promise(function (res, rej) {
      Parse.Cloud.run("getGame", {}, {
        success: res.bind(this),
        error: rej.bind(this)
      });
    });
  };

  GameService.setAction = function (game, action) {

  };

  return GameService
});
