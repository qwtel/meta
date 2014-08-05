/** @jsx React.DOM */
define([
  'service/UserService',
  'view/page/ProfilePage',
  'view/page/HistoryPage',
  'view/page/PlayPage',
  'view/component/NavBarView',
  'react',
  'director'
], function (UserService, ProfilePage, HistoryPage, PlayPage, NavBarView, React, Router) {
  return React.createClass({
    getInitialState: function () {
      return {
        page: this.props.page,
        user: UserService.current()
      }
    },

    componentDidMount: function () {
      this.initRouter();
      this.startHeartbeat();

      var self = this;
      UserService.currentWithStats()
        .then(function (user) {
          self.setState({
            user: user
          });
        })
        .catch(function(error) {
          if (error !== 0) {
            console.log(error);
          }
        });
    },

    getRoutes: function () {
      return {
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
      UserService.startHeartbeat(this.tickHeartbeat);
    },

    tickHeartbeat: function (user) {
      this.setState({
        user: user
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
      if (this.state.page === 'profile') {
        page = ProfilePage({user: this.state.user, logOut: this.props.logOut});
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
  });
});
