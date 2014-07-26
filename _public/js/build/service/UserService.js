define([
  'parse'
], function (Parse) {
  function UserService() {
  }

  UserService.current = function () {
    return Parse.User.current()
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
      Parse.User.logOut();
      res();
    });
  };

  UserService.save = function (user) {
    return user.save()
  };

  return UserService;
});
