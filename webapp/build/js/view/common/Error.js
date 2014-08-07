/** @jsx React.DOM */
define([
  'react'
], function (React) {
  return React.createClass({
    render: function () {
      var message = this.props.message || 'Something went wrong :(';
      return (
        React.DOM.div({className: "error-big"}, 
          message
        )
        );
    }
  });
});
