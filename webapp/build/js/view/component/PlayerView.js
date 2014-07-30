/** @jsx React.DOM */
define([
  'react'
], function (React) {
  return React.createClass({
    getInitialState: function () {
      // TODO: Don't store this here
      return {
        level: '',
        rank: ''
      }
    },

    componentDidMount: function () {
      // TODO: Don't do this here
      var self = this;
      this.props.user.get('statSheet').fetch().then(function (statSheet) {
        self.setState(statSheet.attributes);
      });
    },

    render: function () {
      var user = this.props.user.toJSON();
      var playerView =
        React.DOM.div({className: "other"}, 
          React.DOM.div({className: "banner", style: {backgroundImage: "url(" + user.bannerUrl + ")"}}), 
          React.DOM.div({className: "shield"}), 
          React.DOM.div({className: "profilepic"}, 
            React.DOM.img({src: user.pictureUrl}), 
            React.DOM.div({className: "level dot-pos"}, 
              React.DOM.span({className: "dot"}, this.state.level)
            ), 
            React.DOM.div({className: "rank dot-pos"}, 
              React.DOM.span({className: "dot"}, '#' + this.state.rank)
            ), 
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
