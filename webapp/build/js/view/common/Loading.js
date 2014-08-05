/** @jsx React.DOM */
define([
  'react'
], function(React) {
  return React.createClass({
    render: function () {
      var loading =
        React.DOM.div({className: "spinner"}, 
          React.DOM.div({className: "double-bounce1"}), 
          React.DOM.div({className: "double-bounce2"})
        );
      
      return loading;
    }
  });
});
