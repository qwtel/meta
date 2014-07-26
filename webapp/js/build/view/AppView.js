/** @jsx React.DOM */
define([
  'service/UserService',
  'service/FacebookService',
  'view/page/ProfilePage',
  'view/page/HistoryPage',
  'view/page/PlayPage',
  'view/component/NavBarView',
  'react',
  'director'
], function (UserService, FacebookService, ProfilePage, HistoryPage, PlayPage, NavBarView, React, Router) {
  return React.createClass({
    getInitialState: function () {
      return {
        page: null,
        user: UserService.current()
      }
    },

    componentDidMount: function () {
      this.initRouter();
      this.initHeartbeat();
    },

    initRouter: function () {
      window.router = Router({
        '': this.onRouteChanged.bind(this, 'login'),
        '/': this.onRouteChanged.bind(this, 'login'),
        'login': this.onRouteChanged.bind(this, 'login'),
        'play': this.onRouteChanged.bind(this, 'play'),
        'history': this.onRouteChanged.bind(this, 'history'),
        'profile': this.onRouteChanged.bind(this, 'profile')
        // TODO: 404
      });
      window.router.init('/');
    },

    initHeartbeat: function () {
      UserService.startHeartbeat();
    },

    onRouteChanged: function (page) {
      if (!this.state.user) {
        window.router.setRoute('login');
        this.setPage('login');
      } else {
        this.setPage(page);
      }
    },

    setPage: function (page) {
      this.setState({
        page: page
      })
    },

    render: function () {
      if (!this.state.page) return null;

      var page;
      if (this.state.page === 'login') {
        page = LoginPage(null);
      } else if (this.state.page === 'profile') {
        page = ProfilePage({user: this.state.user});
      } else if (this.state.page === 'history') {
        page = HistoryPage({user: this.state.user});
      } else if (this.state.page === 'play') {
        page = PlayPage({user: this.state.user});
      }

      return (
        React.DOM.div(null, 
          NavBarView({page: this.state.page, newHistory: 2}), 
          page
        )
        );
    }
  })
});
