function beforeSavePlayer(req, res) {
  var user = req.object;

  function validate(key, limit, f) {
    var value = user.get(key);
    if (!value || value.trim().length === 0) {
      res.error(key + ' missing');
    } else if (value.trim().length > limit) {
      user.set(key, value.trim().substring(0, (limit - 1)) + '...');
    }
  }

  // TODO: validate
  //validate('firstName', 30);
  //validate('about', 240);

  res.success();
}

module.exports = beforeSavePlayer;
