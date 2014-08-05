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
        content = <Error />;
      } else if (this.state.loading) {
        content = <Loading />;
      } else {
        var games = this.state.games.map(function (game) {
          return <HistoryGameView key={game.id} game={game} />
        });

        content =
          <ul className="table-view history" style={{marginTop: 0}}>
            <li className="table-view-divider"/>
            {games}
          </ul>;
      }

      var historyPage =
        <div id="history" className="page content">
          {content}
        </div>;

      return historyPage;
    }
  });
});
