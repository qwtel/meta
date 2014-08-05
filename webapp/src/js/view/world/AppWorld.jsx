define([
  'service/UserService',
  'view/page/ProfilePage',
  'view/page/HistoryPage',
  'view/page/PlayPage',
  'view/component/NavBarView',
  'view/common/Error',
  'view/common/Loading',
  'enum/Page',
  'react'
], function (UserService, ProfilePage, HistoryPage, PlayPage, NavBarView, Error, Loading, Page, React) {
  return React.createClass({
    getInitialState: function () {
      return {
        user: null,
        loading: true,
        error: false
      }
    },

    componentDidMount: function () {
      var self = this;
      UserService.currentWithStats()
        .then(function (user) {
          UserService.startHeartbeat(user, self.tickHeartbeat);
          self.setState({
            user: user,
            loading: false
          });
        })
        .catch(function (error) {
          console.error(error);
          self.setState({
            loading: false,
            error: true
          });
        });
    },

    tickHeartbeat: function (user) {
      this.setState({
        user: user
      });
    },

    render: function () {
      var res = null;

      if (this.state.loading) {
        res = <div className="page content"><Loading /></div>;
      } else if (this.state.error) {
        res = <div className="page content"><Error /></div>
      } else {
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
