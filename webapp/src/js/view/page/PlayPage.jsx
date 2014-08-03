define([
  'service/GameService',
  'view/component/PlayerView',
  'config/Action',
  'react'
], function (GameService, PlayerView, Action, React) {
  return React.createClass({
    getInitialState: function () {
      return {
        enemy: null,
        gameState: null
      };
    },

    componentDidMount: function () {
      var self = this;
      GameService.getGame()
        .then(function (game) {
          self.setState({
            enemy: game.enemy,
            gameState: game.state
          });
        })
        .catch(console.error);
    },

    createOnActionClicked: function (action) {
      var self = this;
      return function () {
        GameService.doAction(action)
          .then(function (res) {
            var game = res[0];
            var nextGame = res[1];
            self.setState({
              enemy: nextGame.enemy,
              gameState: nextGame.state
            });
          })
          .catch(console.error);
      };
    },

    render: function () {
      var playPage =
        <div id="play" className="page content">
          {this.state.enemy ? <PlayerView user={this.state.enemy} /> : null}
          <p className="content-padded" style={{paddingTop: 0}}>
            <button className="btn btn-positive btn-block" onClick={this.createOnActionClicked(Action.Cooperate)}>Cooperate</button>
            <button className="btn btn-primary btn-block" onClick={this.createOnActionClicked(Action.Pass)}>Escape</button>
            <button className="btn btn-negative btn-block" onClick={this.createOnActionClicked(Action.Defect)}>Defect</button>
          </p>
        </div>;
      return playPage;
    }
  });
});
