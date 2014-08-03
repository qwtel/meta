/** @jsx React.DOM */
define([
  'service/UserService',
  'config/Action',
  'react'
], function (UserService, Action, React) {
  return React.createClass({
    render: function () {
      var dot;
      switch(this.props.move) {
        case Action.Cooperate: dot = ["Co", 'btn-positive']; break;
        case Action.Pass: dot = ["Es", 'btn-primary']; break;
        case Action.Defect: dot = ["De", 'btn-negative']; break;
      }
      
      var move =
        React.DOM.div({className: "move"}, 
          React.DOM.img({className: "profilepic", src: this.props.player.get('pictureUrl')}), 
          React.DOM.div({className: "name " + dot[1]}, dot[0])
        );
        
      return move;
    }
  });
});
