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
          console.log(games);
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
        content = <Error />;
      } else if (this.state.loading) {
        content = <Loading />;
      } else if (this.state.games.length === 0) {
        content = <Error message="No games to display." />
      } else {
        var games = this.state.games.map(function (game) {
          return <HistoryGameView key={game.id} game={game} user={this.props.user} />
        }, this);
        
        content =
          <ul className="table-view" style={{marginTop: 0}}>
            {games}
          </ul>;
      }

      var historyPage =
        <div id="history" ref="page" className="page content history">
          {content}
        </div>;

      return historyPage;
    }
  });
});
