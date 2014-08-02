var Action = require('cloud/enum/Action.js');

function GameLogic(move1, move2) {
  if (!move1 || !Action[move1]) throw new Error();
  if (!move2 || !Action[move2]) throw new Error();
  this.move1 = move1;
  this.move2 = move2;
}

/*
 GameLogic.Matrix = [
 [[1, 1], [2, -1], [-1, 2]],
 [[-1, 2], [0, 0], [2, -1]],
 [[2, -1], [-1, 2], [-1, -1]]
 ];
 */

GameLogic.prototype.result = function () {
  switch (this.move1) {
    case Action.Cooperate:
      switch (this.move2) {
        case Action.Cooperate: return [1, 1];
        case Action.Pass: return [2, -1];
        case Action.Defect: return [-1, 2];
      }
      break;
    case Action.Pass:
      switch (this.move2) {
        case Action.Cooperate: return [-1, 2];
        case Action.Pass: return [0, 0];
        case Action.Defect: return [2, -1];
      }
      break;
    case Action.Defect:
      switch (this.move2) {
        case Action.Cooperate: return [2, -1];
        case Action.Pass: return [-1, 2];
        case Action.Defect: return [-1, -1];
      }
  }
};

GameLogic.prototype.result1 = function () {
  return this.result()[0];
};

GameLogic.prototype.result2 = function () {
  return this.result()[1];
};

module.exports = GameLogic;
