define([
  'view/HistoryGameMoveView',
  'react'
], function (HistoryGameMoveView, React) {
  return React.createClass({
    render: function () {
      var game =
          <li className="table-view-cell game">
            <HistoryGameMoveView/>
            <p className="result">{'>'}</p>
            <HistoryGameMoveView/>
            <p className="points">{'+2'}</p>
          </li>;

      return game;
    }
  });
});
