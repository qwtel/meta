/** @jsx React.DOM */
define([
  'service/UserService',
  'service/FacebookService',
  'promise',
  'react'
], function (UserService, FacebookService, Promise, React) {
  return React.createClass({
    onLoginClicked: function () {
      UserService.logIn()
        .then(function (user) {
          UserService.startHeartbeat();
          if (!user.existed()) {
            console.log("User signed up and logged in through Facebook!");
            window.router.setRoute('profile');
            FacebookService.fetch();
          } else {
            console.log("User logged in through Facebook!");
            window.router.setRoute('play');
          }
        })
        .catch(function (error, user) {
          // TODO: popup
          console.log("User cancelled the Facebook login or did not fully authorize.", error, user);
        });
    },
    
    render: function () {
      var loginPage =
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
            React.DOM.button({className: "btn btn-primary btn-block", onClick: this.onLoginClicked, style: {backgroundColor: "#4c69ba"}}, "Login with Facebook")
          )
        );
      return loginPage;
    }
  });
});