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
  
  UserService.logOut = function () {
    return new Promise(function (res) {
      clearInterval(UserService._heartbeat);
      delete UserService._heartbeat;
      Parse.User.logOut();
      res();
    });
  };

  UserService.save = function (user) {
    // TODO: Don't expose Parse.Promise
    return user.save()
  };
  
  UserService.startHeartbeat = function () {
    if (!UserService._heartbeat && UserService.current()) {
      console.log("Starting heartbeat...");
      UserService._heartbeat = setInterval(function () {
        if (UserService.current()) {
          console.log("hb");
          Parse.User.current().save();
        }
      }, Config.HeartbeatInterval);
    }
  };
  
  return UserService;
});
