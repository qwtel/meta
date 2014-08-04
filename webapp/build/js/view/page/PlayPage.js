/** @jsx React.DOM */
define([
  'service/GameService',
  'view/component/PlayerView',
  'enum/Action',
  'react'
], function (GameService, PlayerView, Action, React) {
  return React.createClass({
    getInitialState: function () {
      return {
        game: null
      };
    },

    componentDidMount: function () {
      var self = this;
      GameService.getGame()
        .then(function (game) {
          self.setState({
            game: game
          });
        })
        .catch(console.error.bind(console));
    },

    createOnActionClicked: function (action) {
      var self = this;
      return function () {
        GameService.doAction(action)
          .then(function (res) {
            var game = res[0];
            var nextGame = res[1];
            self.setState({
              game: nextGame
            });
          })
          .catch(console.error.bind(console));
      };
    },

    render: function () {
      var playPage =
        React.DOM.div({id: "play", className: "page content"}, 
          this.state.game ? PlayerView({user: this.state.game.get('player1')}) : null, 
          React.DOM.p({className: "content-padded", style: {paddingTop: 0}}, 
            React.DOM.button({className: "btn btn-positive btn-block", onClick: this.createOnActionClicked(Action.Cooperate)}, "Cooperate"), 
            React.DOM.button({className: "btn btn-primary btn-block", onClick: this.createOnActionClicked(Action.Pass)}, "Escape"), 
            React.DOM.button({className: "btn btn-negative btn-block", onClick: this.createOnActionClicked(Action.Defect)}, "Defect")
          )
        );
      return playPage;
    }
  });
});
