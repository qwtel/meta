/** @jsx React.DOM */
define([
  'service/UserService',
  'logic/LevelLogic',
  'view/page/ProfilePage',
  'view/page/HistoryPage',
  'view/page/PlayPage',
  'view/component/NavBarView',
  'view/common/Error',
  'view/common/Loading',
  'enum/Page',
  'react'
], function (UserService, LevelLogic, ProfilePage, HistoryPage, PlayPage, NavBarView, Error, Loading, Page, React) {
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
        res = React.DOM.div({className: "page content"}, Loading(null));
      } else if (this.state.error) {
        res = React.DOM.div({className: "page content"}, Error(null))
      } else {
        //var width = this.props.user.get('statSheet').get('level');
          
        switch (this.props.page) {
          case Page.Profile:
            res = ProfilePage({user: this.state.user});
            break;
          case Page.Play:
            res = PlayPage({user: this.state.user});
            break;
          case Page.History:
            res = HistoryPage({user: this.state.user});
            break;
        }
      }

      /*
      var width = 0;
      if (this.state.user && this.state.user.get('statSheet')) {
        var user = this.state.user;
        var level = user.get('statSheet').get('level');
        var points = user.get('statSheet').get('points');
        var goal = LevelLogic.nextLevel(level);
        width = points / goal;
      }
      */
      
      return (
        React.DOM.div(null, 
          NavBarView({page: this.props.page, newHistory: 0}), 
          res
        )
        );
    }
  });
});
