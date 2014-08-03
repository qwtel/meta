function beforeSavePlayer(req) {
  var user = req.object;
  
  function limit(key, limit) {
    var value = user.get(key);
    if (value && value.trim().length > limit) {
      user.set(key, value.trim().substring(0, (limit - 1)) + '...');
    }
  }
  
  function required(key) {
    var value = user.get(key);
    var result = Parse.Promise.as(true);
    if (!value || value.trim().length === 0) {
      //result = Parse.Promise.error(key + ' missing');
    } 
    return result;
  }

  return required('firstName').then(function () {
    limit('firstName', 30);
    limit('about', 240);
    return user;
  });
}

module.exports = beforeSavePlayer;
