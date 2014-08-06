/** @jsx React.DOM */
define([
  'service/UserService',
  'service/GameService',
  'view/component/HistoryGameView',
  'view/common/Loading',
  'view/common/Error',
  'view/mixin/SetStateSilent',
  'react'
], function (UserService, GameService, HistoryGameView, Loading, Error, SetStateSilent, React) {
  return React.createClass({
    mixins: [SetStateSilent],

    getInitialState: function () {
      return {
        loading: true,
        error: false,
        games: []
      }
    },

    componentDidMount: function () {
      var self = this;
      GameService.getHistory()
        .then(function (games) {
          self.setStateSilent({
            loading: false,
            games: games
          });
        }, function (error) {
          console.error(error);
          self.setStateSilent({
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
          React.DOM.ul({className: "table-view", style: {marginTop: 0}}, 
            games
          );
      }

      var historyPage =
        React.DOM.div({id: "history", ref: "page", className: "page content history"}, 
          content
        );

      return historyPage;
    }
  });
});
