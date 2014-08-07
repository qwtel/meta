define([
  'react'
], function (React) {
  return React.createClass({
    render: function () {
      var message = this.props.message || 'Something went wrong :(';
      return (
        <div className="error-big">
          {message}
        </div>
        );
    }
  });
});
