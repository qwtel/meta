function toPlayerView(game) {
  return new Parse.Query("Game")
    .include('player1.statSheet')
    .include('player2.statSheet')
    .select(['player1', 'player2', 'state'])
    .get(game.id);
}

module.exports = toPlayerView;
