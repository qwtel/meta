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

  UserService.currentStats = function () {
    // TODO: Don't expose Parse.Promise
    return Parse.User.current().get("statSheet").fetch()
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
    return new Promise(function (res) {
      clearInterval(heartbeat);
      heartbeat = null;
      Parse.User.logOut();
      res();
    });
  };

  UserService.save = function (user) {
    // TODO: Don't expose Parse.Promise
    return user.save()
  };

  UserService.startHeartbeat = function (cb) {
    // Actually, there's no need for that...
    /*
     if (!heartbeat && UserService.current()) {
     console.log("Starting heartbeat...");
     Parse.User.current().save();
     heartbeat = setInterval(function () {
     if (UserService.current()) {
     console.log("♥");
     Parse.User.current().save();
     cb();
     }
     }, Config.HeartbeatInterval);
     }
     */
  };

  if (window.Debug) window.UserService = UserService

  return UserService;
});
