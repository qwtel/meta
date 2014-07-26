/** @jsx React.DOM */
define([
  'react'
], function (React) {
  return React.createClass({
    render: function () {
      var move =
          React.DOM.div({className: "move"}, 
            React.DOM.img({className: "profilepic", src: "https://graph.facebook.com/me/picture"}), 
            React.DOM.div({className: "name btn-negative"}, "De")
          );
      return move;
    }
  });
});
