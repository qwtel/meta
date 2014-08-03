/** @jsx React.DOM */
define([
  'service/UserService',
  'view/component/PlayerView',
  'react',
  'moment'
], function (UserService, PlayerView, React, Moment) {
  return React.createClass({
    // TODO: Don't store this here
    getInitialState: function () {
      return {
        level: 1,
        points: 0,
        ppg: 0,
        score: 0,
        rank: 0,
        numGames: 0
      };
    },
    
    componentDidMount: function () {
      var self = this;
      // TODO: Don't do this here
      UserService.currentStats()
        .then(function (statSheet) {
          self.setState(statSheet.attributes);
        }, function(error) {
          console.error("Couldn't load stat sheet", error);
          // TODO: Popup
        });
    },
    
    onSaveClicked: function () {
      var firstName = this.refs.name.getDOMNode().value;
      var about = this.refs.message.getDOMNode().value;

      if (firstName && (firstName = firstName.trim()) !== '') {
        this.props.user.set('firstName', firstName);
      }

      if (about && (about = about.trim()) !== '') {
        this.props.user.set('about', about);
      }

      UserService.save(this.props.user)
        .then(function () {
          this.forceUpdate();
        }.bind(this));
    },

    onLogoutClicked: function () {
      UserService.logOut()
        .then(function () {
          window.router.setRoute('login');
        });
    },

    render: function () {
      var user = this.props.user.toJSON();
      var profile =
        React.DOM.div({id: "profile", className: "page content"}, 
          PlayerView({user: this.props.user}), 
          React.DOM.ul({className: "table-view"}, 
            React.DOM.div({className: "input-row"}, 
              React.DOM.label(null, "Name"), 
              React.DOM.input({type: "text", placeholder: "Name", ref: "name", defaultValue: user.firstName})
            ), 
            React.DOM.div({className: "input-row"}, 
              React.DOM.label(null, "Message"), 
              React.DOM.input({type: "text", placeholder: "Message", ref: "message", defaultValue: user.about})
            ), 
            React.DOM.div({className: "content-padded"}, 
              React.DOM.button({className: "btn btn-primary btn-outlined btn-block", onClick: this.onSaveClicked}, "Save")
            ), 
            React.DOM.li({className: "table-view-cell table-view-divider"}), 
            React.DOM.li({className: "table-view-cell"}, 
              React.DOM.span({className: "pull-left"}, "Level"), 
              React.DOM.span({className: "pull-right"}, this.state.level)
            ), 
            React.DOM.li({className: "table-view-cell"}, 
              React.DOM.span({className: "pull-left"}, "Points"), 
              React.DOM.span({className: "pull-right"}, this.state.points)
            ), 
            React.DOM.li({className: "table-view-cell"}, 
              React.DOM.span({className: "pull-left"}, "Games"), 
              React.DOM.span({className: "pull-right"}, this.state.numGames)
            ), 
            React.DOM.li({className: "table-view-cell"}, 
              React.DOM.span({className: "pull-left"}, "Points per Game"), 
              React.DOM.span({className: "pull-right"}, (this.state.points / this.state.numGames).toFixed(4))
            ), 
            React.DOM.li({className: "table-view-cell"}, 
              React.DOM.span({className: "pull-left"}, "Score"), 
              React.DOM.span({className: "pull-right"}, this.state.score)
            ), 
            React.DOM.li({className: "table-view-cell"}, 
              React.DOM.span({className: "pull-left"}, "Rank"), 
              React.DOM.span({className: "pull-right"}, '#' + this.state.rank)
            ), 
            React.DOM.li({className: "table-view-cell table-view-divider"}), 
            React.DOM.li({className: "table-view-cell"}, 
              React.DOM.span({className: "pull-left"}, "Member since"), 
              React.DOM.span({className: "pull-right"}, Moment(user.createdAt).format('L'))
            ), 
            React.DOM.li({className: "table-view-cell"}, 
              React.DOM.span({className: "pull-left"}, "Last online"), 
              React.DOM.span({className: "pull-right"}, Moment(user.updatedAt).format('LLLL'))
            ), 
            React.DOM.li({className: "table-view-cell table-view-divider"}), 
            React.DOM.div({className: "content-padded"}, 
              React.DOM.button({className: "btn btn-outlined btn-negative btn-block", onClick: this.onLogoutClicked}, "Logout"), 
              React.DOM.button({className: "btn btn-outlined btn-negative btn-block"}, "Reset Stats"), 
              React.DOM.button({className: "btn btn-outlined btn-negative btn-block"}, "Delete Account")
            )
          )
        );
      return profile;
    }
  });
});
