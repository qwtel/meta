var withMasterKey = require('cloud/helper/withMasterKey.js');

var GameLogic = require('cloud/logic/GameLogic.js');

function doAction(req, res) {
  return withMasterKey(function () {
    var user = req.user;
    var game = req.params.game;
    var action = req.params.action;

    if (!user || !game || !action) throw new Error();

    var logic = new GameLogic(null, null);

    // TODO
  });
}

module.exports = doAction;
