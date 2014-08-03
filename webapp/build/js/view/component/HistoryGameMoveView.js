/** @jsx React.DOM */
define([
  'service/UserService',
  'config/Action',
  'react'
], function (UserService, Action, React) {
  return React.createClass({
    getInitialState: function () {
      return {
        pictureUrl: null
      }
    },

    componentDidMount: function () {
      var self = this;
      this.props.player.fetch().then(function (player) {
        self.setState({
          pictureUrl: player.get("pictureUrl")
        })
      })
    },

    render: function () {
      var dot;
      switch(this.props.move) {
        case Action.Cooperate: dot = ["Co", 'btn-positive']; break;
        case Action.Pass: dot = ["Es", 'btn-primary']; break;
        case Action.Defect: dot = ["De", 'btn-negative']; break;
      }
      
      
      var move =
        React.DOM.div({className: "move"}, 
          this.state.pictureUrl ? React.DOM.img({className: "profilepic", src: this.state.pictureUrl}) : null, 
          React.DOM.div({className: "name " + dot[1]}, dot[0])
        );
        
      return move;
    }
  });
});
