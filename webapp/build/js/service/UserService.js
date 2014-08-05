define([
  'config/Config'
], function (Config) {
  function UserService() {
  }

  UserService.current = function () {
    return Parse.User.current()
  };

  UserService.updateStats = function (user) {
    
    return new Promise(function (res, rej) {
      function fuckfuckfuck(user) {
        user.get("statSheet")
          .fetch()
          .then(res, rej);
      }
      
      if (user.get("statSheet")) {
        fuckfuckfuck(user);
      } else {
        user.fetch().then(fuckfuckfuck, rej);
      }
    });
  };

  UserService.currentWithStats = function () {
    return new Promise(function (res, rej) {
      new Parse.Query(Parse.User)
        .include('statSheet')
        .include('currentGame.player1.statSheet')
        .include('currentGame.player2.statSheet')
        .get(Parse.User.current().id)
        .then(res, rej)
    });
  };

  UserService.logIn = function () {
    return new Promise(function (res, rej) {
      Parse.FacebookUtils.logIn(null, {
        success: function (user) {
          res(user);
        },
        error: function (user, error) {
          rej(error, user)
        }
      });
    });
  };

  var heartbeat = null;

  UserService.logOut = function () {
    window.GameService.clearCache(); // TODO: meh...
    UserService.stopHeartbeat();
    Parse.User.logOut();
  };

  UserService.save = function (user) {
    return new Promise(function (res, rej) {
      user.save().then(res, rej);
    });
  };

  UserService.stopHeartbeat = function () {
    console.log("Stopping heartbeat...");
    clearInterval(heartbeat);
    heartbeat = null;
  };
  
  UserService.startHeartbeat = function (user, cb) {
    if (!heartbeat && UserService.current()) {
      console.log("Starting heartbeat...");
      user.save().then(cb);
      heartbeat = setInterval(function () {
        if (UserService.current()) {
          console.log("♥");
          user.save().then(cb);
        }
      }, Config.HeartbeatInterval);
    }
  };

  if (window.Debug) window.UserService = UserService;

  return UserService;
});
