define([
  'service/UserService',
  'service/FacebookService',
  'view/page/ProfilePage',
  'view/NavBarView',
  'view/PlayerView',
  'view/HistoryGameView',
  'react',
  'director'
], function (UserService, FacebookService, ProfilePage, NavBarView, PlayerView, HistoryGameView, React, Router) {
  return React.createClass({
    getInitialState: function () {
      return {
        page: null,
        user: UserService.current()
      }
    },

    loginWithFacebook: function () {
      var self = this;
      UserService.logIn()
        .then(function (user) {
          self.state.user = user;
          if (!user.existed()) {
            console.log("User signed up and logged in through Facebook!");
            self.setPage('profile');
          } else {
            console.log("User logged in through Facebook!");
            self.setPage('play');
          }
          return FacebookService.fetch()
        }).catch(function (error, user) {
          // TODO: popup
          console.log("User cancelled the Facebook login or did not fully authorize.", error, user);
        });
    },

    componentDidMount: function () {
      this.router = Router({
        '/': this.setPageR.bind(this, 'login'),
        'login': this.setPageR.bind(this, 'login'),
        'play': this.setPageR.bind(this, 'play'),
        'history': this.setPageR.bind(this, 'history'),
        'profile': this.setPageR.bind(this, 'profile')
      });
      this.router.init('/');
    },

    setPageR: function (page) {
      if (!this.state.user) {
        this.router.setRoute('login');
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
        page =
          <div className="content">
            <p className="content-padded">
            Meta is a insanely simple mutliplayer game that is loosely based on the
                {' '}
              <a href="http://en.wikipedia.org/wiki/Prisoner's_dilemma">Prisoner's Dilemma</a>
                {', '}
              <a href="http://en.wikipedia.org/wiki/Rock-paper-scissors">Rock-Paper-Scissors</a>
                {' and (uhm..) '}
              <a href="http://www.gotinder.com/">Tinder</a>
            .</p>
            <p className="content-padded">
              <button className="btn btn-primary btn-block" onClick={this.loginWithFacebook} style={{backgroundColor: "#4c69ba"}}>Login with Facebook</button>
            </p>
          </div>;
      } else if (this.state.page === 'profile') {
        page = <ProfilePage user={this.state.user} />
      } else if (this.state.page === 'history') {
        page =
          <div className="content">
            <ul className="table-view history" style={{marginTop: 0}}>
              <li className="table-view-divider">Today</li>
              <HistoryGameView />
              <HistoryGameView />
              <li className="table-view-divider">Yesterday</li>
              <HistoryGameView />
              <HistoryGameView />
              <HistoryGameView />
              <HistoryGameView />
              <HistoryGameView />
            </ul>
          </div>
      } else if (this.state.page === 'play') {
        page =
          <div className="content">
            <PlayerView user={this.state.user} />
            <p className="content-padded" style={{paddingTop: 0}}>
              <button className="btn btn-positive btn-block">Cooperate</button>
              <button className="btn btn-primary btn-block">Pass</button>
              <button className="btn btn-negative btn-block">Defect</button>
            </p>
          </div>;
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
