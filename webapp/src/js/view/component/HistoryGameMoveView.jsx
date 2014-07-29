define([
  'service/UserService',
  'react'
], function (UserService, React) {
  return React.createClass({
    render: function () {
      var move =
          <div className="move">
            <img className="profilepic" src={UserService.current().get("pictureUrl")} />
            <div className="name btn-negative">De</div>
          </div>;
      return move;
    }
  });
});
