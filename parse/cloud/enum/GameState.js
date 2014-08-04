var Enum = require('cloud/enum/Enum.js');

var GameState = new Enum({
  FirstMove: 0,
  SecondMove: 1,
  GameOver: 2
}, {
  next: function (gameState) {
    switch (gameState) {
      case GameState.FirstMove: return GameState.SecondMove;
      case GameState.SecondMove: return GameState.GameOver;
      case GameState.GameOver: throw Error("Game Over!")
    }
  }
});

module.exports = GameState;

