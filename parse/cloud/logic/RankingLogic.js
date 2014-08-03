function RankingLogic() {
}

RankingLogic.naiveScore = function(up, down) {
  return up - down;
};

// http://amix.dk/blog/post/19588
RankingLogic.wilsonScore = function(pos, n) {
  var phat, z;
  if (n <= 0 || pos <= 0) {
    return 0;
  }
  z = 1.96;
  phat = pos / n;
  return (phat + z * z / (2 * n) - z * Math.sqrt((phat * (1 - phat) + z * z / (4 * n)) / n)) / (1 + z * z / n);
};

// TODO: bayesian ranking

module.exports = RankingLogic;
