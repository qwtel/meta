var whenAdmin = require('cloud/helper/whenAdmin.js');
var withMasterKey = require('cloud/helper/withMasterKey.js');

function resetCurrentGame(req, res) {
  return whenAdmin(req, res)(function () {
    return withMasterKey(function () {
      req.user.unset("currentGame");
      req.user.save().then(res.success);
    });
  });
}

module.exports = resetCurrentGame;
