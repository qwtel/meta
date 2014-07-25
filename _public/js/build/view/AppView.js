/** @jsx React.DOM */
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
          React.DOM.div({className: "content"}, 
            React.DOM.p({className: "content-padded"}, 
            "Meta is a insanely simple mutliplayer game that is loosely based on the", 
                ' ', 
              React.DOM.a({href: "http://en.wikipedia.org/wiki/Prisoner's_dilemma"}, "Prisoner's Dilemma"), 
                ', ', 
              React.DOM.a({href: "http://en.wikipedia.org/wiki/Rock-paper-scissors"}, "Rock-Paper-Scissors"), 
                ' and (uhm..) ', 
              React.DOM.a({href: "http://www.gotinder.com/"}, "Tinder"), 
            "."), 
            React.DOM.p({className: "content-padded"}, 
              React.DOM.button({className: "btn btn-primary btn-block", onClick: this.loginWithFacebook, style: {backgroundColor: "#4c69ba"}}, "Login with Facebook")
            )
          );
      } else if (this.state.page === 'profile') {
        page = ProfilePage({user: this.state.user})
      } else if (this.state.page === 'history') {
        page =
          React.DOM.div({className: "content"}, 
            React.DOM.ul({className: "table-view history", style: {marginTop: 0}}, 
              React.DOM.li({className: "table-view-divider"}, "Today"), 
              HistoryGameView(null), 
              HistoryGameView(null), 
              React.DOM.li({className: "table-view-divider"}, "Yesterday"), 
              HistoryGameView(null), 
              HistoryGameView(null), 
              HistoryGameView(null), 
              HistoryGameView(null), 
              HistoryGameView(null)
            )
          )
      } else if (this.state.page === 'play') {
        page =
          React.DOM.div({className: "content"}, 
            PlayerView({user: this.state.user}), 
            React.DOM.p({className: "content-padded", style: {paddingTop: 0}}, 
              React.DOM.button({className: "btn btn-positive btn-block"}, "Cooperate"), 
              React.DOM.button({className: "btn btn-primary btn-block"}, "Pass"), 
              React.DOM.button({className: "btn btn-negative btn-block"}, "Defect")
            )
          );
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
