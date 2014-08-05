/** @jsx React.DOM */
define([
  'react'
], function (React) {
  return React.createClass({
    render: function () {
      var user = this.props.user.toJSON();

      var dots = null;
      var statsSheet = this.props.user.get('statSheet');
      var level, rank;
      if (statsSheet && (level = statsSheet.get('level')) !== undefined && (rank = statsSheet.get('rank')) !== undefined) {
        dots = [
          React.DOM.div({key: "level", className: "level dot-pos"}, 
            React.DOM.span({className: "dot"}, level)
          ),
          React.DOM.div({key: "rank", className: "rank dot-pos"}, 
            React.DOM.span({className: "dot"}, '#' + rank)
          )
        ];
      }

      var playerView =
        React.DOM.div({className: "other"}, 
          React.DOM.div({className: "banner-wrapper"}, 
             user.bannerUrl ? React.DOM.div({className: "banner", style: {backgroundImage: "url(" + user.bannerUrl + ")"}}) : null
          ), 
          React.DOM.div({className: "shield"}), 
          React.DOM.div({className: "profilepic"}, 
             user.pictureUrl ? React.DOM.img({src: user.pictureUrl}) : null, 
            dots, 
            React.DOM.div({className: "is-online dot-pos"}, 
               this.isOnline(user) ? React.DOM.div({className: "dot"}) : null
            )
          ), 
          React.DOM.div({className: "about content-padded"}, 
            React.DOM.h4(null, 
            user.firstName, 
            user.minAge ? (', ' + user.minAge + '+') : ''
            ), 
            React.DOM.div(null, 
              React.DOM.p(null, user.about)
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
