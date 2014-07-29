/** @jsx React.DOM */
define([
  'service/UserService',
  'react'
], function (UserService, React) {
  return React.createClass({
    render: function () {
      var move =
          React.DOM.div({className: "move"}, 
            React.DOM.img({className: "profilepic", src: UserService.current().get("pictureUrl")}), 
            React.DOM.div({className: "name btn-negative"}, "De")
          );
      return move;
    }
  });
});
