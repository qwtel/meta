/** @jsx React.DOM */
define([
  'service/UserService',
  'view/component/PlayerView',
  'react',
  'moment'
], function (UserService, PlayerView, React, Moment) {
  return React.createClass({
    componentDidMount: function () {
      var self = this;
      UserService.currentStats()
        .then(function () {
          self.forceUpdate();
        }, console.error);
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
      var profile = null;
      if (this.props.user) {
        var user = this.props.user.toJSON();
        var stats = this.props.user.get('statSheet').toJSON();

        profile =
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
                React.DOM.span({className: "pull-right"}, stats.level)
              ), 
              React.DOM.li({className: "table-view-cell"}, 
                React.DOM.span({className: "pull-left"}, "Points"), 
                React.DOM.span({className: "pull-right"}, stats.points)
              ), 
              React.DOM.li({className: "table-view-cell"}, 
                React.DOM.span({className: "pull-left"}, "Games"), 
                React.DOM.span({className: "pull-right"}, stats.numGames)
              ), 
              React.DOM.li({className: "table-view-cell"}, 
                React.DOM.span({className: "pull-left"}, "Points per Game"), 
                React.DOM.span({className: "pull-right"}, (stats.points / stats.numGames).toFixed(4))
              ), 
              React.DOM.li({className: "table-view-cell"}, 
                React.DOM.span({className: "pull-left"}, "Score"), 
                React.DOM.span({className: "pull-right"}, stats.score)
              ), 
              React.DOM.li({className: "table-view-cell"}, 
                React.DOM.span({className: "pull-left"}, "Rank"), 
                React.DOM.span({className: "pull-right"}, '#' + stats.rank)
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
      }

      return profile;
    }
  });
});
