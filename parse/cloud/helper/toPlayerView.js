function toPlayerView(game) {
  // TODO: find enemy
  return {
    enemy: game.get('player1'),
    state: game.get('state')
  }
}

module.exports = toPlayerView;
