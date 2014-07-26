define([
  'service/UserService',
  'view/component/PlayerView',
  'react'
], function (UserService, PlayerView, React) {
  return React.createClass({
    render: function () {
      var plagePage =
        <div className="content">
          <PlayerView user={this.props.user} />
          <p className="content-padded" style={{paddingTop: 0}}>
            <button className="btn btn-positive btn-block">Cooperate</button>
            <button className="btn btn-primary btn-block">Pass</button>
            <button className="btn btn-negative btn-block">Defect</button>
          </p>
        </div>;
      return plagePage;
    }
  });
});
