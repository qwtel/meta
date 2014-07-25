/** @jsx React.DOM */
define([
  'react'
], function (React) {
  return React.createClass({
    render: function () {
      var user = this.props.user.toJSON();

      var comp =
        React.DOM.div({className: "other"}, 
          React.DOM.div({className: "banner", style: {backgroundImage: "url(" + user.bannerUrl + ")"}}), 
          React.DOM.div({className: "shield"}), 
          React.DOM.div({className: "profilepic"}, 
            React.DOM.img({src: user.pictureUrl}), 
            React.DOM.div({className: "level dot-pos"}, 
              React.DOM.span({className: "dot"}, "1")
            ), 
            React.DOM.div({className: "rank dot-pos"}, 
              React.DOM.span({className: "dot"}, '#', "0")
            ), 
            React.DOM.div({className: "lastmoves"}, 
              React.DOM.div({className: "move co"}), 
              React.DOM.div({className: "move co"}), 
              React.DOM.div({className: "move de"}), 
              React.DOM.div({className: "move pa"}), 
              React.DOM.div({className: "move co"})
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
      return comp;
    }
  });
});
