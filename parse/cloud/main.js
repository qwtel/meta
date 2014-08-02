var Bot = Parse.Object.extend("Bot");

var beforeSavePlayer = require('cloud/functions/beforeSavePlayer.js');
var afterSavePlayer = require('cloud/functions/afterSavePlayer.js');
var getGame = require('cloud/functions/getGame.js');
var doAction = require('cloud/functions/doAction.js');

var initBots = require('cloud/functions/admin/initBots.js');
var resetCurrentGame = require('cloud/functions/admin/resetCurrentGame.js');

// CLOUD FUNCTIONS

// Validation and Consistency
Parse.Cloud.beforeSave(Parse.User, beforeSavePlayer);
Parse.Cloud.beforeSave(Bot, beforeSavePlayer);

Parse.Cloud.afterSave(Parse.User, afterSavePlayer);
Parse.Cloud.afterSave(Bot, afterSavePlayer);

// User functions
Parse.Cloud.define("getGame", getGame);
Parse.Cloud.define('doAction', doAction);

// Admin functions
Parse.Cloud.define("initBots", initBots);
Parse.Cloud.define("resetCurrentGame", resetCurrentGame);
