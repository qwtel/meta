define(function () {
  function LevelLogic() {
  }

  // using the Pentagonal numbers (http://oeis.org/A000326) 
  LevelLogic.nextLevel = function (level) {
    var n;
    n = level;
    return n * (3 * n - 1) / 2;
  };

  // calculates the sum of all previous levels
  LevelLogic.prevLevels = function (level) {
    var i, prev;
    prev = 0;
    i = 0;
    while (i < level - 1) {
      i++;
      prev += LevelLogic.nextLevel(i);
    }
    return prev;
  };

  LevelLogic.isLevelUp = function (points, level) {
    return (points >= LevelLogic.nextLevel(level));
  };
  
  return LevelLogic;
});
