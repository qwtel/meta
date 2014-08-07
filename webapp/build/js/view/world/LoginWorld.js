/** @jsx React.DOM */
define([
  'service/UserService',
  'service/FacebookService',
  'view/component/NavBarView',
  'enum/Page',
  'react'
], function (UserService, FacebookService, NavBarView, Page, React) {
  return React.createClass({
    onLoginClicked: function () {
      UserService.logIn()
        .then(function (user) {
          if (!user.existed()) {
            console.log("User signed up and logged in through Facebook!");
            
            // TODO: Fetch on server ?
            FacebookService.fetch(user).then(function () {
              window.router.setRoute(Page.Profile);
            });
          } 
          else {
            console.log("User logged in through Facebook!");
            window.router.setRoute(Page.Play);
          }
        }, console.error.bind(console));
    },

    render: function () {
      var loginPage =
        React.DOM.div({id: "login", className: "page content"}, 
          React.DOM.p({className: "content-padded"}, 
          "Meta is a simple multi-player game that is loosely based on the", 
                ' ', 
            React.DOM.a({href: "http://en.wikipedia.org/wiki/Prisoner's_dilemma"}, "Prisoner's Dilemma"), 
                ', ', 
            React.DOM.a({href: "http://en.wikipedia.org/wiki/Rock-paper-scissors"}, "Rock-Paper-Scissors"), 
                ' and ', 
            React.DOM.a({href: "http://www.gotinder.com/"}, "Tinder"), 
          "."
          ), 
          React.DOM.p({className: "content-padded"}, 
            React.DOM.button({className: "btn btn-primary btn-block", onClick: this.onLoginClicked, style: {backgroundColor: "#4c69ba"}}, "Login with Facebook")
          ), 
          React.DOM.p({className: "content-padded"}, 
            React.DOM.strong(null, "Note:"), " Meta will use some of your public information for this game.", 
            ' ', 
            "Specifically it will use your profile picture, cover photo, first name (optional) and 'about me' text (if available, optional)." 
          ), 
          React.DOM.p({className: "content-padded"}, 
            "Meta will never post on your wall.", 
            React.DOM.br(null), 
            "Meta will never let you down.", 
            React.DOM.br(null), 
            "Meta will never run around and desert you."
          )
        );

      return (
        React.DOM.div(null, 
          NavBarView({page: "login"}), 
          loginPage
        )
        );
    }
  });
});
