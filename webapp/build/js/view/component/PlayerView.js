/** @jsx React.DOM */
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
          React.DOM.div({key: "level", className: "level dot-pos"}, 
            React.DOM.span({className: "dot"}, level)
          ),
          React.DOM.div({key: "rank", className: "rank dot-pos"}, 
            React.DOM.span({className: "dot"}, '#' + rank)
          )
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
          React.DOM.div({className: "dot " + dot[1]}, 
            dot[0]
          )
      } else if (this.props.state === GameState.SecondMove) {
        move = 
          React.DOM.div({className: "dot"}, 
            '?'
          );
      }

      var playerView =
        React.DOM.div({className: "other"}, 
          React.DOM.div({className: "banner-wrapper"}, 
             user.bannerUrl ? React.DOM.div({className: "banner", style: {backgroundImage: "url(" + user.bannerUrl + ")"}}) : null
          ), 
          React.DOM.div({className: "shield"}), 
          React.DOM.div({className: "about content-padded"}, 
            React.DOM.h4(null, 
            user.firstName, 
            user.minAge ? (', ' + user.minAge + '+') : ''
            ), 
            React.DOM.div(null, 
              React.DOM.p(null, user.about)
            )
          ), 
          React.DOM.div({className: "profilepic"}, 
             user.pictureUrl ? React.DOM.img({src: user.pictureUrl}) : null, 
            dots, 
            React.DOM.div({className: "is-online dot-pos"}, 
               this.isOnline(user) ? React.DOM.div({className: "dot"}) : null
            ), 
            React.DOM.div({className: "enemy-move dot-pos"}, 
              move
            )
          )
        );

      return playerView;
    },

    isOnline: function (user) {
      return new Date(user.updatedAt).getTime() + 1000 * 60 > new Date().getTime();
    }
  });
});
