define([
  'service/UserService',
  'view/page/ProfilePage',
  'view/page/HistoryPage',
  'view/page/PlayPage',
  'view/component/NavBarView',
  'enum/Page',
  'react'
], function (UserService, ProfilePage, HistoryPage, PlayPage, NavBarView, Page, React) {
  return React.createClass({
    getInitialState: function () {
      return {
        user: UserService.current()
      }
    },

    componentDidMount: function () {
      this.startHeartbeat();
      UserService.updateStats(this.state.user).catch(console.error.bind(console));
    },

    startHeartbeat: function () {
      UserService.startHeartbeat(this.tickHeartbeat);
    },

    tickHeartbeat: function (user) {
      this.setState({
        user: user
      });
    },

    render: function () {
      var res = null;
      switch (this.props.page) {
        case Page.Profile:
          res = <ProfilePage user={this.state.user} />;
          break;
        case Page.Play:
          res = <PlayPage user={this.state.user} />;
          break;
        case Page.History:
          res = <HistoryPage user={this.state.user} />;
          break;
      }

      return (
        <div>
          <NavBarView page={this.props.page} newHistory={0} />
          {res}
        </div>
        );
    }
  });
});
