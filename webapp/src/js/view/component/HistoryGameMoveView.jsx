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
        <div className="move">
          {this.state.pictureUrl ? <img className="profilepic" src={this.state.pictureUrl} /> : null}
          <div className={"name " + dot[1]}>{dot[0]}</div>
        </div>;
        
      return move;
    }
  });
});
