/** @jsx React.DOM */
define([
  'service/UserService',
  'view/component/PlayerView',
  'react'
], function (UserService, PlayerView, React) {
  return React.createClass({
    render: function () {
      var plagePage =
        React.DOM.div({id: "play", className: "page content"}, 
          PlayerView({user: this.props.user}), 
          React.DOM.p({className: "content-padded", style: {paddingTop: 0}}, 
            React.DOM.button({className: "btn btn-positive btn-block"}, "Cooperate"), 
            React.DOM.button({className: "btn btn-primary btn-block"}, "Pass"), 
            React.DOM.button({className: "btn btn-negative btn-block"}, "Defect")
          )
        );
      return plagePage;
    }
  });
});
