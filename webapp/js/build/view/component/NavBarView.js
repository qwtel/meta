/** @jsx React.DOM */
define([
  'react'
], function (React) {
  return React.createClass({
    render: function () {
      var left, right;

      var Titles = {
        play: 'Play',
        history: 'History',
        profile: 'Profile',
        login: 'Meta'
      };

      if (this.props.page === 'play') {
        var newHistory;
        if (this.props.newHistory && this.props.newHistory > 0) {
          newHistory = React.DOM.span({className: "badge"}, this.props.newHistory)
        }

        left =
            React.DOM.a({className: "btn btn-link btn-nav pull-left", href: "#/profile"}, 
              React.DOM.span({className: "icon icon-left-nav"}), 
              ' ', 
              'Profile'
            );
        right =
            React.DOM.a({className: "btn btn-link btn-nav pull-right", href: "#/history"}, 
              newHistory, 
              'History', 
              ' ', 
              React.DOM.span({className: "icon icon-right-nav"})
            );
      } else if (this.props.page === 'profile') {
        right =
            React.DOM.a({className: "btn btn-link btn-nav pull-right", href: "#/play"}, 
              'Play', 
              ' ', 
              React.DOM.span({className: "icon icon-right-nav"})
            );

      } else if (this.props.page === 'history') {
        left =
            React.DOM.a({className: "btn btn-link btn-nav pull-left", href: "#/play"}, 
              React.DOM.span({className: "icon icon-left-nav"}), 
              ' ', 
              'Play'
            );
      }

      var header =
          React.DOM.header({className: "bar bar-nav"}, 
            left, 
            right, 
            React.DOM.h1({className: "title"}, Titles[this.props.page])
          );

      return header;
    }
  });
});
