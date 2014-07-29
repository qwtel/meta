/** @jsx React.DOM */
define([
  'service/UserService',
  'view/component/HistoryGameView',
  'react'
], function (UserService, HistoryGameView, React) {
  return React.createClass({
    render: function () {
      var historyPage =
        React.DOM.div({id: "history", className: "page content"}, 
          React.DOM.ul({className: "table-view history", style: {marginTop: 0}}, 
            React.DOM.li({className: "table-view-divider"}, "Today"), 
            HistoryGameView(null), 
            HistoryGameView(null), 
            React.DOM.li({className: "table-view-divider"}, "Yesterday"), 
            HistoryGameView(null), 
            HistoryGameView(null), 
            HistoryGameView(null), 
            HistoryGameView(null), 
            HistoryGameView(null)
          )
        );

      return historyPage;
    }
  });
});
