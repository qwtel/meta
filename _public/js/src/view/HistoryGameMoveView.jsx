define([
  'react'
], function (React) {
  return React.createClass({
    render: function () {
      var move =
          <div className="move">
            <img className="profilepic" src="https://graph.facebook.com/me/picture"/>
            <div className="name btn-negative">De</div>
          </div>;
      return move;
    }
  });
});
