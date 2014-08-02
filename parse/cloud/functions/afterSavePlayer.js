var withMasterKey = require('cloud/helper/withMasterKey.js');

var StatSheet = Parse.Object.extend("StatSheet");

function saveStatSheet(user) {
  if (user.get('statSheet')) {
    return Parse.Promise.as(user);
  } 
  else {
    return withMasterKey(function () {
      console.log("New user, creating StatSheet");

      var statSheet = new StatSheet();
      
      setUser(statSheet, user);
      
      return statSheet.save({
        level: 1,
        points: 0,
        ppg: 0,
        score: 0,
        rank: 0,
        numGames: 0,
        numCoop: 0,
        numPass: 0,
        numDefect: 0
      }).then(function (statSheet) {
        return user.save('statSheet', statSheet);
      });
    });
  }
}

function afterSavePlayer(req) {
  var player = req.object;
  saveStatSheet(player);
}

function setUser(statSheet, user) {
  if (user.className !== "Bot") {
    statSheet.set('user', user)
  } else {
    statSheet.set('bot', user)
  }
}

module.exports = afterSavePlayer;

