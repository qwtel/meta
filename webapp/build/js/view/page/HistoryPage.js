/** @jsx React.DOM */
define([
  'service/UserService',
  'service/GameService',
  'view/component/HistoryGameView',
  'view/common/Loading',
  'view/common/Error',
  'react'
], function (UserService, GameService, HistoryGameView, Loading, Error, React) {
  return React.createClass({
    getInitialState: function () {
      return {
        loading: true,
        error: false,
        games: []
      };
    },

    componentDidMount: function () {
      var self = this;
      GameService.getHistory()
        .then(function (games) {
          self.setState({
            loading: false,
            games: games
          });
        }, function (error) {
          console.error(error);
          self.setState({
            loading: false,
            error: true
          })
        });
    },

    render: function () {
      var content = null;

      if (this.state.error) {
        content = Error(null);
      } else if (this.state.loading) {
        content = Loading(null);
      } else {
        var games = this.state.games.map(function (game) {
          return HistoryGameView({key: game.id, game: game})
        });

        content =
          React.DOM.ul({className: "table-view history", style: {marginTop: 0}}, 
            React.DOM.li({className: "table-view-divider"}), 
            games
          );
      }

      var historyPage =
        React.DOM.div({id: "history", className: "page content"}, 
          content
        );

      return historyPage;
    }
  });
});
