var withMasterKey = require('cloud/helper/withMasterKey.js');

var StatSheet = Parse.Object.extend("StatSheet");

function resetStats(req) {
  return withMasterKey(function () {
    var user = req.user;
    if (!user) {
      return Parse.Promise.error('Not logged in');
    }

    var statSheet = new StatSheet();
    statSheet.set('user', user);
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
      return user.save({
        statSheet: statSheet
      });
    });
  });
}

module.exports = resetStats;

