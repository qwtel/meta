/** @jsx React.DOM */
define([
  'view/component/HistoryGameMoveView',
  'react'
], function (HistoryGameMoveView, React) {
  return React.createClass({
    render: function () {
      var game =
          React.DOM.li({className: "table-view-cell game"}, 
            HistoryGameMoveView(null), 
            React.DOM.p({className: "result"}, '>'), 
            HistoryGameMoveView(null), 
            React.DOM.p({className: "points"}, '+2')
          );

      return game;
    }
  });
});
