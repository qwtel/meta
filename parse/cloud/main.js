var beforeSavePlayer = require('cloud/functions/beforeSavePlayer');
var afterSavePlayer = require('cloud/functions/afterSavePlayer');

var getGame = require('cloud/functions/getGame');
var doAction = require('cloud/functions/doAction');
var getHistory = require('cloud/functions/getHistory');
var resetStats = require('cloud/functions/resetStats');

var initBots = require('cloud/functions/admin/initBots');
var resetCurrentGame = require('cloud/functions/admin/resetCurrentGame');
var initLinearRanks = require('cloud/functions/admin/initLinearRanks');

var calculateRankBounds = require('cloud/jobs/calculateRankBounds');
var doBotMoves = require('cloud/jobs/doBotMoves');

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
Parse.Cloud.define('getHistory', sendResponse(getHistory));
Parse.Cloud.define('resetStats', sendResponse(resetStats));

// Admin functions
Parse.Cloud.define("initBots", sendResponse(initBots));
Parse.Cloud.define("resetCurrentGame", sendResponse(resetCurrentGame));
Parse.Cloud.define("initLinearRanks", sendResponse(initLinearRanks));

// Background jobs
Parse.Cloud.job('calculateRankBounds', calculateRankBounds);
Parse.Cloud.job('doBotMoves', doBotMoves);
