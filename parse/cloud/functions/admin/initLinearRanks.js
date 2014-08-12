var whenAdmin = require('cloud/helper/whenAdmin.js');
var withMasterKey = require('cloud/helper/withMasterKey.js');

var StatSheet = Parse.Object.extend("StatSheet");

var min = -1;
var max = 4;

function toFixed(number, n) {
  var factor = Math.pow(10, n);
  return Math.round(number * factor) / factor;
}

function range(n) {
  return Array.apply(undefined, Array(n)).map(function (dontcare, i) {
    return i;
  });
}

function linearSpace(start, end, totalCount) {
  var step = (end - start) / totalCount;
  return range(totalCount).map(function (i) {
    return toFixed(start + step * i, 2);
  });
}

function initLinearRanks(req) {
  return whenAdmin(req)(function () {
    return withMasterKey(function () {
      var promises = linearSpace(-1, 4, 100)
        .map(function (v) {
          var sheet = new StatSheet();
          sheet.set('ppg', v);
          sheet.set('numGames', 10);
          return sheet.save();
        });
      return Parse.Promise.when(promises);
    });
  });
}

module.exports = initLinearRanks;

