function whenAdmin(req, res) {
  return function (f) {
    if (req.user.get('authData').facebook.id == '10202226173755916') {
      return f();
    } else {
      res.error("Get out of my backyard!");
    }
  }
}

module.exports = whenAdmin;
