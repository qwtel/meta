define([
  'service/GameService',
  'view/component/PlayerView',
  'view/component/HistoryGameView',
  'view/common/Loading',
  'view/common/Error',
  'enum/Action',
  'react'
], function (GameService, PlayerView, HistoryGameView, Loading, Error, Action, React) {
  return React.createClass({
    getInitialState: function () {
      return {
        game: this.props.user.get('currentGame'),
        loading: false,
        error: false,
        lastGame: null,
        showResult: false,
        loadingResult: false
      };
    },

    componentDidMount: function () {
      if (!this.state.game) {
        this.setState({
          loading: true
        });
        var self = this;
        GameService.getGame()
          .then(function (game) {
            self.setState({
              loading: false,
              game: game
            });
          }, function (error) {
            console.error(error);
            self.setState({
              loading: false,
              error: true
            });
          });
      }
    },

    createOnActionClicked: function (action) {
      var self = this;
      return function () {
        self.setState({
          loadingResult: true
        });

        GameService.doAction(action)
          .then(function (res) {
            var game = res[0];
            var nextGame = res[1];
            self.setState({
              lastGame: game,
              game: nextGame,
              showResult: true,
              loadingResult: false
            });
          }, function () {
            console.error(error);
            self.setState({
              loadingResult: false,
              error: true
            });
          });
      };
    },

    nextGame: function () {
      this.setState({
        showResult: false
      });
    },

    render: function () {
      var buttons = null;
      var playerView = null;
      var loading = null;

      if (this.state.error) {
        loading = <Error />;
      } else if (this.state.loading) {
        loading = <Loading />;
      } else {
        if (this.state.showResult) {
          if (this.state.lastGame) {
            playerView = <PlayerView user={this.state.lastGame.get('player1')} />;
          }

          buttons = [
            <ul className="table-view history" style={{marginTop: 0}}>
              <HistoryGameView key={this.state.lastGame.id} game={this.state.lastGame} />
            </ul>,
            <p className="content-padded" style={{paddingTop: 0}}>
              <button className="btn btn-normal btn-outlined btn-block" onClick={this.nextGame}>Next</button>
            </p>
          ];

        }
        else {
          if (this.state.game) {
            playerView = <PlayerView user={this.state.game.get('player1')} />;
          }

          if (this.state.loadingResult) {
            buttons = <Loading />;
          } else {
            buttons =
              <p className="content-padded" style={{paddingTop: 0}}>
                <button className="btn btn-positive btn-block" onClick={this.createOnActionClicked(Action.Cooperate)}>Cooperate</button>
                <button className="btn btn-primary btn-block" onClick={this.createOnActionClicked(Action.Pass)}>Escape</button>
                <button className="btn btn-negative btn-block" onClick={this.createOnActionClicked(Action.Defect)}>Defect</button>
              </p>;
          }
        }
      }

      var playPage =
        <div id="play" className="page content">
          {loading}
          {playerView}
          {buttons}
        </div>;

      return playPage;
    }
  });
});
