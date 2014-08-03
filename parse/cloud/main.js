var beforeSavePlayer = require('cloud/functions/beforeSavePlayer.js');
var afterSavePlayer = require('cloud/functions/afterSavePlayer.js');

var getGame = require('cloud/functions/getGame.js');
var doAction = require('cloud/functions/doAction.js');

var initBots = require('cloud/functions/admin/initBots.js');
var resetCurrentGame = require('cloud/functions/admin/resetCurrentGame.js');

var Bot = Parse.Object.extend("Bot");

function sendResponse(f) {
  return function (req, res) {
    f(req)
      .then(function (result) {
        res.success(result);
      }, function (error) {
        if (error instanceof Error) {
          res.error(error.message);
        } else {
          res.error(error);
        }
      });
  }
}

// CLOUD FUNCTIONS

// Validation and Consistency
Parse.Cloud.beforeSave(Parse.User, sendResponse(beforeSavePlayer));
Parse.Cloud.beforeSave(Bot, sendResponse(beforeSavePlayer));

Parse.Cloud.afterSave(Parse.User, afterSavePlayer);
Parse.Cloud.afterSave(Bot, afterSavePlayer);

// User functions
Parse.Cloud.define("getGame", sendResponse(getGame));
Parse.Cloud.define('doAction', sendResponse(doAction));

// Admin functions
Parse.Cloud.define("initBots", sendResponse(initBots));
Parse.Cloud.define("resetCurrentGame", sendResponse(resetCurrentGame));
