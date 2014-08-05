define([
  'service/UserService',
  'view/component/PlayerView',
  'view/common/Loading',
  'view/common/Error',
  'enum/Page',
  'react',
  'moment'
], function (UserService, PlayerView, Loading, Error, Page, React, Moment) {
  return React.createClass({
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
            self.setState({
              loading: false
            });
          }, function (error) {
            console.error(error);
            self.setState({
              loading: false,
              error: true
            });
          });
      }
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
      UserService.logOut();
      window.router.setRoute(Page.Login);
    },

    render: function () {
      var playerView = null;
      var basic = null;
      var statSheet = null;
      var timeStuff = null;

      if (this.props.user) {
        var user = this.props.user.toJSON();
        var stats = this.props.user.get('statSheet').toJSON();

        playerView =
          <PlayerView user={this.props.user} />;

        basic = [
          <div className="input-row">
            <label>Name</label>
            <input type="text" placeholder="Name" ref="name" defaultValue={user.firstName} />
          </div>,
          <div className="input-row">
            <label>Message</label>
            <input type="text" placeholder="Message" ref="message" defaultValue={user.about} />
          </div>,
          <div className="content-padded">
            <button className="btn btn-normal btn-outlined btn-block" onClick={this.onSaveClicked}>Save</button>
          </div>
        ];

        if (this.state.error) {
          statSheet = <Error />;
        } else if (this.state.loading) {
          statSheet = <Loading />
        } else {
          statSheet = [
            <li className="table-view-cell">
              <span className="pull-left">Level</span>
              <span className="pull-right">{stats.level}</span>
            </li>,
            <li className="table-view-cell">
              <span className="pull-left">Points</span>
              <span className="pull-right">{stats.points}</span>
            </li>,
            <li className="table-view-cell">
              <span className="pull-left">Games</span>
              <span className="pull-right">{stats.numGames}</span>
            </li>,
            <li className="table-view-cell">
              <span className="pull-left">Points per Game</span>
              <span className="pull-right">{(stats.points / stats.numGames).toFixed(4)}</span>
            </li>,
            <li className="table-view-cell">
              <span className="pull-left">Score</span>
              <span className="pull-right">{stats.score}</span>
            </li>,
            <li className="table-view-cell">
              <span className="pull-left">Rank</span>
              <span className="pull-right">{'#' + stats.rank}</span>
            </li>
          ];
        }

        timeStuff = [
          <li className="table-view-cell">
            <span className="pull-left">Member since</span>
            <span className="pull-right">{Moment(user.createdAt).format('L')}</span>
          </li>,
          <li className="table-view-cell">
            <span className="pull-left">Last online</span>
            <span className="pull-right">{Moment(user.updatedAt).format('LLLL')}</span>
          </li>
        ];
      }

      var dangerZone =
        <div className="content-padded">
          <button className="btn btn-outlined btn-negative btn-block" onClick={this.onLogoutClicked}>Logout</button>
          <button className="btn btn-outlined btn-negative btn-block">Reset Stats</button>
          <button className="btn btn-outlined btn-negative btn-block">Delete Account</button>
        </div>;

      var profile =
        <div id="profile" className="page content">
          {playerView}
          <ul className="table-view">
            {basic}
            <li className="table-view-cell table-view-divider"/>
            {statSheet}
            <li className="table-view-cell table-view-divider"/>
            {timeStuff}
            <li className="table-view-cell table-view-divider"/>
            {dangerZone}
          </ul>
        </div>;
      return profile;
    }
  });
});
