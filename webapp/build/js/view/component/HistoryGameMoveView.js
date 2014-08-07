/** @jsx React.DOM */
define([
  'service/UserService',
  'enum/Action',
  'react'
], function (UserService, Action, React) {
  return React.createClass({
    render: function () {
      var dot;
      switch(this.props.move) {
        case Action.Cooperate: dot = ["C", 'btn-positive']; break;
        case Action.Pass: dot = ["E", 'btn-primary']; break;
        case Action.Defect: dot = ["D", 'btn-negative']; break;
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
