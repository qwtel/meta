define([
  'enum/GameState',
  'enum/Action',
  'react'
], function (GameState, Action, React) {
  return React.createClass({
    getInitialState: function () {
      return {
        rank: undefined
      }
    },
    
    getRank: function (statSheet) {
      var stats = statSheet.toJSON();
      var ppg = (stats.points / stats.numGames) || 0;
      return new Parse.Query("RankBound")
        .greaterThanOrEqualTo('min', ppg)
        .ascending('min')
        .first()
        .then(function (rankBound) {
          return rankBound.get('rank');
        });
    },
    
    componentDidMount: function () {
      if (this.props.calcRank) {
        var self = this;
        this.getRank(this.props.user.get('statSheet'))
          .then(function (rank) {
            self.setState({
              rank: rank
            })
          });
      }
    },
    
    render: function () {
      var user = this.props.user.toJSON();

      var dots = null;
      var statsSheet = this.props.user.get('statSheet');
      var level, rank;
      if (statsSheet && (level = statsSheet.get('level')) !== undefined && 
        (rank = this.props.rank || this.state.rank) !== undefined) {
        
        dots = [
          <div key="level" className="level dot-pos">
            <span className="dot">{level}</span>
          </div>,
          <div key="rank" className="rank dot-pos">
            <span className="dot">{'#' + rank}</span>
          </div>
        ];
      }

      var move;
      if (this.props.move) {
        var dot;
        switch(this.props.move) {
          case Action.Cooperate: dot = ["C", 'btn-positive']; break;
          case Action.Pass: dot = ["E", 'btn-primary']; break;
          case Action.Defect: dot = ["D", 'btn-negative']; break;
        }
        move =
          <div className={"dot " + dot[1]}>
            {dot[0]}
          </div>
      } else if (this.props.state === GameState.SecondMove) {
        move = 
          <div className="dot">
            {'?'}
          </div>;
      }

      var playerView =
        <div className="other">
          <div className="banner-wrapper">
            { user.bannerUrl ? <div className="banner" style={{backgroundImage: "url(" + user.bannerUrl + ")"}} /> : null }
          </div>
          <div className="shield"/>
          <div className="about content-padded">
            <h4>
            {user.firstName}
            {user.minAge ? (', ' + user.minAge + '+') : ''}
            </h4>
            <div>
              <p>{user.about}</p>
            </div>
          </div>
          <div className="profilepic">
            { user.pictureUrl ? <img src={user.pictureUrl} /> : null }
            {dots}
            <div className="is-online dot-pos">
              { this.isOnline(user) ? <div className="dot"/> : null }
            </div>
            <div className="enemy-move dot-pos">
              {move}
            </div>
          </div>
        </div>;

      return playerView;
    },

    isOnline: function (user) {
      return new Date(user.updatedAt).getTime() + 1000 * 60 > new Date().getTime();
    }
  });
});
