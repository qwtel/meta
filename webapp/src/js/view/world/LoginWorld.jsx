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
        <div id="login" className="page content">
          <p className="content-padded">
          <strong>Meta</strong> is a simple multi-player game that is loosely based on the
                {' '}
            <a href="http://en.wikipedia.org/wiki/Prisoner's_dilemma">Prisoner's Dilemma</a>
                {', '}
            <a href="http://en.wikipedia.org/wiki/Rock-paper-scissors">Rock-Paper-Scissors</a>
                {' and '}
            <a href="http://www.gotinder.com/">Tinder</a>
          .
          </p>
          <p className="content-padded">
            <button className="btn btn-primary btn-block" onClick={this.onLoginClicked} style={{backgroundColor: "#4c69ba"}}>Login with Facebook</button>
          </p>
          <p className="content-padded">
            <strong>Meta</strong> will use your public information for the purpose of this game.
            {' '}
            Specifically it will use your profile picture, cover photo, first name (optional) and 'about me' text (if available, optional). 
          </p>
          <p className="content-padded">
            <strong>Meta</strong> will never post on your wall.
            <br/>
            <strong>Meta</strong> will never let you down.
            <br/>
            <strong>Meta</strong> will never run around and desert you.
          </p>
        </div>;

      return (
        <div>
          <NavBarView page="login" />
          {loginPage}
        </div>
        );
    }
  });
});
