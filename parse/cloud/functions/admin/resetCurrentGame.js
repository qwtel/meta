var whenAdmin = require('cloud/helper/whenAdmin.js');
var withMasterKey = require('cloud/helper/withMasterKey.js');

function resetCurrentGame(req) {
  return whenAdmin(req)(function () {
    return withMasterKey(function () {
      req.user.unset("currentGame");
      return req.user.save();
    });
  });
}

module.exports = resetCurrentGame;
