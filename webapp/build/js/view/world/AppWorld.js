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
  
  var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
  
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
    
    fuckThisShit: function () {
      this.forceUpdate();
    },
    
    render: function () {
      var res = null;

      if (this.state.loading) {
        res = React.DOM.div({key: "loading", className: "page content"}, Loading(null));
      } else if (this.state.error) {
        res = React.DOM.div({key: "error", className: "page content"}, Error(null))
      } else {
        //var width = this.props.user.get('statSheet').get('level');
          
        switch (this.props.page) {
          case Page.Profile:
            res = ProfilePage({key: Page.Profile, user: this.state.user});
            break;
          case Page.Play:
            res = PlayPage({key: Page.Play, user: this.state.user, renderParent: this.fuckThisShit});
            break;
          case Page.History:
            res = HistoryPage({key: Page.History, user: this.state.user});
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
      
      var numNotifications  = this.state.user ? this.state.user.get("numNotifications") : 0;
      
      return (
        React.DOM.div(null, 
          NavBarView({page: this.props.page, newHistory: numNotifications}), 
          ReactCSSTransitionGroup({transitionName: "carousel"}, 
            res
          )
        )
        );
    }
  });
});
