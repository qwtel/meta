/** @jsx React.DOM */
define([
  'service/GameService',
  'view/component/PlayerView',
  'config/Action',
  'react'
], function (GameService, PlayerView, Action, React) {
  return React.createClass({
    getInitialState: function () {
      return {
        enemy: null
      };
    },

    componentDidMount: function () {
      var self = this;
      GameService.getGame()
        .then(function (game) {
          self.setState({
            enemy: game.enemy
          });
        })
        .catch(function (error) {
          console.error(error);
          // TODO
        })
    },
    
    createOnActionClicked: function(action) {
      return function () {
        GameService.setAction(action)
      };
    },
    
    render: function () {
      var playPage =
        React.DOM.div({id: "play", className: "page content"}, 
          this.state.enemy !== null ? PlayerView({user: this.state.enemy}) : null, 
          React.DOM.p({className: "content-padded", style: {paddingTop: 0}}, 
            React.DOM.button({className: "btn btn-positive btn-block", onClick: this.createOnActionClicked(Action.Cooperate)}, "Cooperate"), 
            React.DOM.button({className: "btn btn-primary btn-block", onClick: this.createOnActionClicked(Action.Pass)}, "Pass"), 
            React.DOM.button({className: "btn btn-negative btn-block", onClick: this.createOnActionClicked(Action.Defect)}, "Defect")
          )
        );
      return playPage;
    }
  });
});
