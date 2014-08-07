/** @jsx React.DOM */
define([
  'service/UserService',
  'service/FacebookService',
  'view/mixin/SetStateSilent',
  'view/component/PlayerView',
  'view/common/Loading',
  'view/common/Error',
  'enum/Page',
  'react',
  'moment'
], function (UserService, FacebookService, SetStateSilent, PlayerView, Loading, Error, Page, React, Moment) {
  var BasicView = React.createClass({displayName: 'BasicView',
    getInitialState: function () {
      return {
        changed: false,
        firstName: this.props.user.firstName,
        about: this.props.user.about
      }
    },

    createOnInputChanged: function (name) {
      var self = this;
      return function (e) {
        var state = {
          changed: true
        };
        state[name] = e.target.value;
        self.setState(state);
      }
    },

    onSaveClicked: function () {
      this.setState({
        changed: false
      });
      this.props.onSaveClicked(this.state.firstName, this.state.about);
    },

    render: function () {
      var button = null;
      if (this.state.changed) {
        button =
          React.DOM.div({className: "content-padded"}, 
            React.DOM.button({className: "btn btn-primary btn-block", onClick: this.onSaveClicked}, "Save")
          );
      }

      return (
        React.DOM.div(null, 
          React.DOM.div({className: "input-row"}, 
            React.DOM.label(null, "Name"), 
            React.DOM.input({type: "text", placeholder: "Name", ref: "firstName", value: this.state.firstName, onChange: this.createOnInputChanged('firstName')})
          ), 
          React.DOM.div({className: "input-row"}, 
            React.DOM.label(null, "Message"), 
            React.DOM.input({type: "text", placeholder: "Message", ref: "about", value: this.state.about, onChange: this.createOnInputChanged('about')})
          ), 
          button
        ));
    }
  });

  var CellView = React.createClass({displayName: 'CellView',
    render: function () {
      return (
        React.DOM.li({className: "table-view-cell"}, 
          React.DOM.span({className: "pull-left"}, this.props.key), 
          React.DOM.span({className: "pull-right"}, this.props.value)
        )
        );
    }
  });

  var TableView = React.createClass({displayName: 'TableView',
    render: function () {
      var statsView = this.props.data.map(function (d) {
        return CellView({key: d[0], value: d[1]})
      });

      return React.DOM.div(null, statsView);
    }
  });

  var StatsView = React.createClass({displayName: 'StatsView',
    render: function () {
      var stats = this.props.stats;
      var data = [
        ['Level', stats.level],
        ['Points', stats.points],
        ['Games', stats.numGames],
        ['Points per Game', (stats.points / stats.numGames).toFixed(4)],
        ['Score', stats.score],
        ['Rank', '#' + stats.rank]
      ];
      return TableView({data: data})
    }
  });

  var TimeView = React.createClass({displayName: 'TimeView',
    render: function () {
      var user = this.props.user;
      var data = [
        ['Member since', Moment(user.createdAt).format('L')],
        ['Last seen', Moment(user.updatedAt).format('LLLL')]
      ];
      return TableView({data: data})
    }
  });

  return React.createClass({
    mixins: [SetStateSilent],

    getInitialState: function () {
      return {
        loading: true,
        error: false
      }
    },

    componentDidMount: function () {
      var self = this;
      if (this.props.user) {
        UserService.updateStats(this.props.user)
          .then(function () {
            self.setStateSilent({
              loading: false
            });
          }, function (error) {
            console.error(error);
            self.setStateSilent({
              loading: false,
              error: true
            });
          });
      }
    },

    onSaveClicked: function (firstName, about) {
      // TODO: Move validation to UserService
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
      UserService.logOut();
      window.router.setRoute(Page.Login);
    },

    onUpdateFbClicked: function () {
      /*
       var self = this;
       FacebookService.update(this.props.user)
       .then(function () {
       return self.props.user.fetch()
       })
       .then(function () {
       self.forceUpdate();
       });
       */
    },

    render: function () {
      var playerView = null;
      var basic = null;
      var statSheet = null;
      var timeStuff = null;
      var facebookyStuff = null;

      // what a mess...
      if (this.props.user && this.props.user.get('statSheet') && this.props.user.get('statSheet')) {
        var user = this.props.user.toJSON();
        var stats = this.props.user.get('statSheet').toJSON();
        playerView =
          PlayerView({user: this.props.user});

        basic =
          BasicView({user: user, onSaveClicked: this.onSaveClicked});

        if (this.state.error) {
          statSheet = Error(null);
        } else if (this.state.loading) {
          statSheet = Loading(null);
        } else {
          statSheet = StatsView({stats: stats});
          timeStuff = TimeView({user: this.props.user});
        }

        /*
         facebookyStuff =
         <div className="content-padded">
         <button className="btn btn-outlined btn-normal btn-block" onClick={this.onUpdateFbClicked} >
         Update Facebook Data
         </button>
         </div>;
         */
      }

      var dangerZone =
        React.DOM.div({className: "content-padded"}, 
          React.DOM.button({className: "btn btn-outlined btn-negative btn-block", onClick: this.onLogoutClicked}, "Logout"), 
          React.DOM.button({className: "btn btn-outlined btn-negative btn-block"}, "Reset Stats"), 
          React.DOM.button({className: "btn btn-outlined btn-negative btn-block"}, "Delete Account")
        );

      var profile =
        React.DOM.div({id: "profile", ref: "page", className: "profile page content"}, 
          playerView, 
          React.DOM.ul({className: "table-view"}, 
              basic, 
            React.DOM.li({className: "table-view-cell table-view-divider"}), 
              statSheet, 
            React.DOM.li({className: "table-view-cell table-view-divider"}), 
              timeStuff, 
            React.DOM.li({className: "table-view-cell table-view-divider"}), 
              facebookyStuff, 
            React.DOM.li({className: "table-view-cell table-view-divider"}), 
              dangerZone
          )
        );
      return profile;
    }
  });
});
