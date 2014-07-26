define([
  'service/UserService',
  'service/FacebookService',
  'react'
], function (UserService, FacebookService, React) {
  return React.createClass({
    onLoginClicked: function () {
      var self = this;
      UserService.logIn()
        .then(function (user) {
          self.state.user = user;
          if (!user.existed()) {
            console.log("User signed up and logged in through Facebook!");
            self.setPage('profile');
            FacebookService.fetch()
          } else {
            console.log("User logged in through Facebook!");
            self.setPage('play');
          }
        })
        .catch(function (error, user) {
          // TODO: popup
          console.log("User cancelled the Facebook login or did not fully authorize.", error, user);
        });
    },
    
    render: function () {
      var loginPage =
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
            <button className="btn btn-primary btn-block" onClick={this.onLoginClicked} style={{backgroundColor: "#4c69ba"}}>Login with Facebook</button>
          </p>
        </div>;
      return loginPage;
    }
  });
});
