define([
  'react'
], function(React) {
  return React.createClass({
    render: function () {
      var loading =
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>;
      
      return loading;
    }
  });
});
