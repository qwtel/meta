function whenAdmin(req) {
  return function (f) {
    if (req.user && req.user.get('authData').facebook.id == '10202226173755916') {
      return f();
    } else {
      return Parse.Promise.error(Error("Get out of my backyard!"));
    }
  }
}

module.exports = whenAdmin;
