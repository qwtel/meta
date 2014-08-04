/** @jsx React.DOM */
define([
  'service/UserService',
  'view/page/LoginPage',
  'view/page/ProfilePage',
  'view/page/HistoryPage',
  'view/page/PlayPage',
  'view/component/NavBarView',
  'react',
  'director'
], function (UserService, LoginPage, ProfilePage, HistoryPage, PlayPage, NavBarView, React, Router) {
  return React.createClass({
    getInitialState: function () {
      return {
        page: null,
        user: null
      }
    },

    componentDidMount: function () {
      this.initRouter();
      this.startHeartbeat();
      
      var self = this;
      UserService.currentWithStats().then(function (user) {
        self.setState({
          user: user
        })
      }, console.error)
    },
    
    getRoutes: function () {
      return {
        '': this.onRouteChanged.bind(this, 'login'),
        '/': this.onRouteChanged.bind(this, 'login'),
        'login': this.onRouteChanged.bind(this, 'login'),
        'play': this.onRouteChanged.bind(this, 'play'),
        'history': this.onRouteChanged.bind(this, 'history'),
        'profile': this.onRouteChanged.bind(this, 'profile')
        // TODO: 404
      };
    },

    initRouter: function () {
      window.router = Router(this.getRoutes());
      window.router.init('/');
    },

    startHeartbeat: function () {
      var self = this;
      UserService.startHeartbeat(function () {
        self.forceUpdate();
      });
    },

    onRouteChanged: function (page) {
      if (!UserService.current()) {
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
          NavBarView({page: this.state.page, newHistory: 0}), 
          page
        )
        );
    }
  })
});
