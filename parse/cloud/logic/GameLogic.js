var Action = require('cloud/enum/Action.js');


function GameLogic(move1, move2) {
  this.move1 = Action.values().indexOf(move1);
  this.move2 = Action.values().indexOf(move2);
  if (this.move1 === -1) throw Error();
  if (this.move2 === -1) throw Error();
}

/*
 GameLogic.Matrix = [
 [[ 1,  1], [ 2, -1], [-1,  2]], // E[X] = [ 2, 2]
 [[-1,  3], [ 0,  0], [ 3, -1]], // E[X] = [ 2, 2] 
 [[ 4, -1], [-1,  4], [-1, -1]]  // E[X] = [ 2, 2] 
 ];
 */

/*
 GameLogic.Matrix = [
 [[ 2,  2], [ 4, -1], [-1,  4]], // E[X] = [ 5, 5]
 [[-1,  4], [ 0,  0], [ 4, -1]], // E[X] = [ 3, 3] 
 [[ 4, -1], [-1,  4], [-1, -1]]  // E[X] = [ 2, 2] 
 ];
 */

/*
 GameLogic.Matrix = [
 [[ 1,  1], [ 2, -1], [-1,  2]], // E[X] = [ 2, 2]
 [[-1,  2], [ 0,  0], [ 2, -1]], // E[X] = [ 1, 1] 
 [[ 2, -1], [-1,  2], [-1, -1]]  // E[X] = [ 0, 0] 
 ];
 */

GameLogic.Matrix = [
  [
    [ 1, 1],
    [ 2, -1],
    [-1, 2]
  ],
  [
    [-1, 2],
    [ 0, 0],
    [ 2, -1]
  ],
  [
    [ 2, -1],
    [-1, 2],
    [-1, -1]
  ]
];

GameLogic.prototype.result = function () {
  return GameLogic.Matrix[this.move1][this.move2];
};

GameLogic.prototype.result1 = function () {
  return this.result()[0];
};

GameLogic.prototype.result2 = function () {
  return this.result()[1];
};

module.exports = GameLogic;
