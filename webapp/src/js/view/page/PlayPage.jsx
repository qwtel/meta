define([
  'service/GameService',
  'view/component/PlayerView',
  'view/component/HistoryGameView',
  'view/common/Loading',
  'view/common/Error',
  'view/mixin/SetStateSilent',
  'enum/Action',
  'enum/GameState',
  'react'
], function (GameService, PlayerView, HistoryGameView, Loading, Error, SetStateSilent, Action, GameState, React) {
  return React.createClass({
    mixins: [SetStateSilent],

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
            self.setStateSilent({
              loading: false,
              game: game,
            });
          }, function (error) {
            console.error(error.message);
            self.setStateSilent({
              loading: false,
              error: true
            });
          });
      }
    },

    createOnActionClicked: function (action) {
      var self = this;
      if (this.state.selected !== action) {
        return function (e) {
          e.stopPropagation();
          self.setState({
            selected: action
          });
        }
      } else {
        return function () {
          self.setState({
            loadingResult: true
          });

          GameService.doAction(self.props.user, self.state.game, action)
            .then(function (res) {
              
              var game = res[1];
              var nextGame = res[2];

              // TODO: dynamic dispatch? something?
              if (game.get('state') === GameState.GameOver) {
                console.log(res);
                self.setState({
                  lastGame: game,
                  game: nextGame,
                  showResult: true,
                  loadingResult: false,
                  selected: null
                });
              } else {
                self.setState({
                  lastGame: game,
                  game: nextGame,
                  showResult: false,
                  loadingResult: false,
                  selected: null
                });
              }
            }, function (error) {
              console.error(error);
              self.setState({
                loadingResult: false,
                error: true,
                selected: null
              });
            });
        };
      }
    },

    nextGame: function () {
      this.setState({
        showResult: false
      });
    },
    
    deselect: function () {
      this.setState({
        selected: null
      })
    },

    render: function () {
      var buttons = null;
      var playerView = null;
      var loading = null;

      var userNum;
      
      if (this.state.error) {
        loading = <Error />;
      } else if (this.state.loading) {
        loading = <Loading />;
      } else {
        if (this.state.showResult) {
          
          userNum = this.state.lastGame.get('player1').id !== this.props.user.id ? 1 : 2;
          playerView = <PlayerView user={this.state.lastGame.get('player' + userNum)} move={this.state.lastGame.get('move' + userNum)} />;

          buttons =
            <div>
              <ul className="table-view history" style={{marginTop: 0}}>
                <HistoryGameView key={this.state.lastGame.id} user={this.props.user} game={this.state.lastGame} />
              </ul>
              <p className="content-padded" style={{paddingTop: 0}}>
                <button className="btn btn-normal btn-outlined btn-block" onClick={this.nextGame}>Next</button>
              </p>
            </div>;

        }
        else {
          if (this.state.game) {
            userNum = this.state.game.get('player1').id !== this.props.user.id ? 1 : 2;
            playerView = <PlayerView user={this.state.game.get('player' + userNum)} state={this.state.game.get('state')} />;
          }

          if (this.state.loadingResult) {
            buttons = <Loading />;
          } else {
            var data = [
              [Action.Cooperate, 'Cooperate'],
              [Action.Pass, 'Escape', 'btn-primary'],
              [Action.Defect, 'Defect', 'btn-negative']
            ];

            var btns = data.map(function (d) {
              var selected = this.state.selected === d[0];
              
              var classes = React.addons.classSet({
                'btn': true,
                'btn-block': true,
                'btn-outlined': !selected,
                'btn-positive': d[0] === Action.Cooperate,
                'btn-primary': d[0] === Action.Pass,
                'btn-negative': d[0] === Action.Defect
              });
              
              var text = selected ? 'Go »' : d[1];

              return (
                <button
                key={d[0]}
                className={classes}
                onClick={this.createOnActionClicked(d[0])}>
                  {text}
                </button>
                );
            }, this);

            buttons =
              <p className="content-padded" style={{paddingTop: 0}}>
                {btns}
              </p>;
          }
        }
      }

      var playPage =
        <div id="play" ref="page" className="play page content" onClick={this.deselect}>
          {loading}
          {playerView}
          {buttons}
        </div>;

      return playPage;
    }
  });
});
