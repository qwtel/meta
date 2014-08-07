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
        <div className="move">
          <img className="profilepic" src={this.props.player.get('pictureUrl')} />
          <div className={"name " + dot[1]}>{dot[0]}</div>
        </div>;
        
      return move;
    }
  });
});
