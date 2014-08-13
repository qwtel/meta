var withMaterKey = require('cloud/helper/withMasterKey');

var RankBound = Parse.Object.extend("RankBound");
var StatSheet = Parse.Object.extend("StatSheet");

function range(n) {
  return Array.apply(undefined, Array(n)).map(function (dontcare, i) {
    return i;
  });
}

function getRankBound(rank) {
  return new Parse.Query(RankBound)
    .equalTo('rank', rank)
    .first()
    .then(function (obj) {
      return obj ? obj : new RankBound();
    });
}

function calculateRankBounds(req, status) {
  return withMaterKey(function () {
    return new Parse.Query(StatSheet)
      .greaterThanOrEqualTo('numGames', 10)
      .count()
      .then(function (numUsers) {
        var onePercent = Math.round(numUsers / 100);
        var promises = range(100).map(function (i) {
          return new Parse.Query(StatSheet)
            .greaterThanOrEqualTo('numGames', 10)
            .descending('ppg')
            .skip(i * onePercent)
            .first()
            .then(function (borderUser) {
              if (!borderUser) return Prase.Promise.error("User at position " + i * onePercent + " does not exists.");
              return getRankBound(i + 1)
                .then(function (bound) {
                  bound.set('rank', i + 1);
                  bound.set('min', borderUser.get('ppg'));
                  return bound.save();
                });
            });
        });
        return Parse.Promise.when(promises)
      })
      .then(function (bounds) {
        status.success("Calculated rank bounds.");
      }, function (error) {
        status.error("Something went wrong while calculating rank bounds.");
        logError(error);
      });
  });
}

// duplicate in doBotMoves
function logError(error) {
  function helper(error) {
    if (error.message) {
      error = error.message;
    }
    console.error(error);
  }

  if (error.length) error.forEach(helper);
  else helper(error);
}

module.exports = calculateRankBounds;
