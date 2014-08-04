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


  UserService.currentWithStats = function () {
    return new Promise(function (res, rej) {
      new Parse.Query(Parse.User)
        .include('statSheet')
        .get(Parse.User.current().id)
        .then(res, rej)
    });
  };

  UserService.updateStats = function (user) {
    return new Promise(function (res, rej) {
      user.get("statSheet")
        .fetch()
        .then(res, rej);
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
    // TODO: No promise
    return new Promise(function (res) {
      clearInterval(heartbeat);
      heartbeat = null;
      Parse.User.logOut();
      res();
    });
  };

  UserService.save = function (user) {
    return new Promise(function (res, rej) {
      user.save().then(res, rej);
    });
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
