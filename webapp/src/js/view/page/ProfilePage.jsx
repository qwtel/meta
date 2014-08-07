define([
  'service/UserService',
  'service/FacebookService',
  'view/mixin/SetStateSilent',
  'view/component/PlayerView',
  'view/common/Loading',
  'view/common/Error',
  'enum/Page',
  'react',
  'moment',
  'ratchet'
], function (UserService, FacebookService, SetStateSilent, PlayerView, Loading, Error, Page, React, Moment) {
  var BasicView = React.createClass({
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
          <div className="content-padded">
            <button className="btn btn-primary btn-block" onClick={this.onSaveClicked}>Save</button>
          </div>;
      }

      return (
        <div>
          <div className="input-row">
            <label>Name</label>
            <input type="text" placeholder="Name" ref="firstName" value={this.state.firstName} onChange={this.createOnInputChanged('firstName')} />
          </div>
          <div className="input-row">
            <label>Message</label>
            <input type="text" placeholder="Message" ref="about" value={this.state.about} onChange={this.createOnInputChanged('about')} />
          </div>
          {button}
        </div>);
    }
  });

  var CellView = React.createClass({
    render: function () {
      return (
        <li className="table-view-cell">
          <span className="pull-left">{this.props.key}</span>
          <span className="pull-right">{this.props.value}</span>
        </li>
        );
    }
  });

  var TableView = React.createClass({
    render: function () {
      var statsView = this.props.data.map(function (d) {
        return <CellView key={d[0]} value={d[1]} />
      });

      return (
        <div>
          {statsView}
          {this.props.children}
        </div>
        );
    }
  });

  var StatsView = React.createClass({
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
      return <TableView data={data} />;
    }
  });

  var TimeView = React.createClass({
    render: function () {
      var user = this.props.user;

      var now = new Date();
      var serverUpdatedAt = new Date(user.updatedAt);
      var updatedAt = serverUpdatedAt.getTime() > now.getTime() ? now : serverUpdatedAt

      var data = [
        ['Member since', Moment(user.createdAt).format('L')],
        ['Last seen', Moment(updatedAt).fromNow()]
      ];
      return <TableView data={data} />
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
          <PlayerView user={this.props.user} />;

        basic =
          <BasicView user={user} onSaveClicked={this.onSaveClicked} />;

        if (this.state.error) {
          statSheet = <Error />;
        } else if (this.state.loading) {
          statSheet = <Loading />;
        } else {
          statSheet = <StatsView stats={stats} />;
          timeStuff = <TimeView user={this.props.user} />;
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
        <div className="content-padded">
          <button className="btn btn-outlined btn-negative btn-block" onClick={this.onLogoutClicked}>Logout</button>
          <button className="btn btn-outlined btn-negative btn-block">Reset Stats</button>
          <button className="btn btn-outlined btn-negative btn-block">Delete Account</button>
        </div>;

      var profile =
        <div id="profile" ref="page" className="profile page content">
          {playerView}
          <ul className="table-view">
              {basic}
            <li className="table-view-cell table-view-divider"/>
              {statSheet}
            <li className="table-view-cell table-view-divider"/>
              {timeStuff}
            <li className="table-view-cell table-view-divider"/>
              {facebookyStuff}
            <li className="table-view-cell table-view-divider"/>
              {dangerZone}
          </ul>
        </div>;
      return profile;
    }
  });
});
