define([
  'view/component/HistoryGameMoveView',
  'logic/GameLogic',
  'react'
], function (HistoryGameMoveView, GameLogic, React) {

  function sign(n) {
    return n > 0 ? ('+' + n) : ('' + n);
  }

  return React.createClass({
    render: function () {
      console.log('HistoryGameView render');

      var move1 = this.props.game.get('move1');
      var move2 = this.props.game.get('move2');
      
      var logic = new GameLogic(move1, move2);

      var r1 = logic.result1();
      var r2 = logic.result2();

      var gt;
      if (r1 > r2) {
        gt = '>';
      } else if (r1 < r2) {
        gt = "<"
      } else {
        gt = '='
      }

      var row =
        <li className="table-view-cell game">
          <HistoryGameMoveView player={this.props.game.get('player1')} move={this.props.game.get('move1')} />
          <p className="result">{gt}</p>
          <HistoryGameMoveView player={this.props.game.get('player2')} move={this.props.game.get('move2')} />
          <p className="points">{sign(r1) + '/' + sign(r2)}</p>
        </li>;

      return row;
    }
  });
});
