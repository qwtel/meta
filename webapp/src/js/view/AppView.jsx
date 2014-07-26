define([
  'service/UserService',
  'service/FacebookService',
  'view/page/LoginPage',
  'view/page/ProfilePage',
  'view/page/HistoryPage',
  'view/page/PlayPage',
  'view/component/NavBarView',
  'react',
  'director'
], function (UserService, FacebookService, LoginPage, ProfilePage, HistoryPage, PlayPage, NavBarView, React, Router) {
  return React.createClass({
    getInitialState: function () {
      return {
        page: null
      }
    },

    componentDidMount: function () {
      this.initRouter();
      this.startHeartbeat();
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

    startHeartbeat: function () {
      UserService.startHeartbeat();
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
        page = <LoginPage />;
      } else if (this.state.page === 'profile') {
        page = <ProfilePage user={UserService.current()} />;
      } else if (this.state.page === 'history') {
        page = <HistoryPage user={UserService.current()} />;
      } else if (this.state.page === 'play') {
        page = <PlayPage user={UserService.current()} />;
      }

      return (
        <div>
          <NavBarView page={this.state.page} newHistory={2} />
          {page}
        </div>
        );
    }
  })
});