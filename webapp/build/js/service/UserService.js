define([
  'config/Config',
  'promise',
  'parse'
], function (Config, Promise, Parse) {
  function UserService() {
  }

  UserService.current = function () {
    return Parse.User.current()
  };

  UserService.updateStats = function (user) {
    return new Promise(function (res, rej) {
      if (user.get("statSheet")) {
        user.get("statSheet")
          .fetch()
          .then(res, rej);
      } else {
        rej('No statSheet on user!');
      }
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
  
  UserService.startHeartbeat = function (cb) {
    if (!heartbeat && UserService.current()) {
      console.log("Starting heartbeat...");
      Parse.User.current().save().then(cb);
      heartbeat = setInterval(function () {
        if (UserService.current()) {
          console.log("♥");
          Parse.User.current().save().then(cb);
        }
      }, Config.HeartbeatInterval);
    }
  };

  if (window.Debug) window.UserService = UserService;

  return UserService;
});
