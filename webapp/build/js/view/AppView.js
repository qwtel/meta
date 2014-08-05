/** @jsx React.DOM */
define([
  'service/UserService',
  'view/world/LoginWorld',
  'view/world/AppWorld',
  'enum/Page',
  'react',
  'director'
], function (UserService, LoginWorld, AppWorld, Page, React, Router) {
  return React.createClass({
    getInitialState: function () {
      return {
        page: Page.Play
      }
    },

    componentDidMount: function () {
      this.initRouter();
    },

    getRoutes: function () {
      var routes;
      return {
        '/': this.onRouteChanged.bind(this, Page.Play),
        '/login': this.onRouteChanged.bind(this, Page.Login),
        '/play': this.onRouteChanged.bind(this, Page.Play),
        '/history': this.onRouteChanged.bind(this, Page.History),
        '/profile': this.onRouteChanged.bind(this, Page.Profile),
        '*': this.onRouteChanged.bind(this, Page.NotFound)
      };
    },

    initRouter: function () {
      window.router = Router(this.getRoutes());
      window.router.init('/');
    },

    onRouteChanged: function (page) {
      if (!UserService.current()) {
        window.router.setRoute(Page.Login);
        this.setState({
          page: Page.Login
        });
      } else {
        this.setState({
          page: page
        });
      }
    },

    render: function () {
      var content;
      if (UserService.current()) {
        content = AppWorld({page: this.state.page});
      } else {
        content = LoginWorld(null)
      }

      return content;
    }
  });
});
