define([
  'service/UserService',
  'service/GameService',
  'view/component/HistoryGameView',
  'react'
], function (UserService, GameService, HistoryGameView, React) {
  return React.createClass({
    getInitialState: function () {
      return {
        games: []
      };
    },

    componentDidMount: function () {
      var self = this;
      GameService.getHistory()
        .then(function (games) {
          self.setState({
            games: games
          })
        })
        .catch(console.error)
    },

    render: function () {
      
      var games = this.state.games.map(function(game) {
        return <HistoryGameView key={game.id} game={game} />
      });
      
      var historyPage =
        <div id="history" className="page content">
          <ul className="table-view history" style={{marginTop: 0}}>
            <li className="table-view-divider">Games</li>
            {games}
          </ul>
        </div>;

      return historyPage;
    }
  });
});
