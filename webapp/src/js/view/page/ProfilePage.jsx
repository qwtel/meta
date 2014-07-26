define([
  'service/UserService',
  'view/component/PlayerView',
  'react',
  'moment'
], function (UserService, PlayerView, React, Moment) {
  return React.createClass({
    getInitialState: function () {
      return {
        level: '',
        points: '',
        ppg: '',
        score: '',
        rank: ''
      };
    },
    
    componentDidMount: function () {
      var self = this;
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
        <div id="profile" className="content">
          <PlayerView user={this.props.user} />
          <ul className="table-view">
            <div className="input-row">
              <label>Name</label>
              <input type="text" placeholder="Name" ref="name" defaultValue={user.firstName} />
            </div>
            <div className="input-row">
              <label>Message</label>
              <input type="text" placeholder="Message" ref="message" defaultValue={user.about} />
            </div>
            <div className="content-padded">
              <button className="btn btn-primary btn-block" onClick={this.onSaveClicked}>Save</button>
            </div>
            <li className="table-view-cell table-view-divider"/>
            <li className="table-view-cell">
              <span className="pull-left">Level</span>
              <span className="pull-right">{this.state.level}</span>
            </li>
            <li className="table-view-cell">
              <span className="pull-left">Points</span>
              <span className="pull-right">{this.state.points}</span>
            </li>
            <li className="table-view-cell">
              <span className="pull-left">Points per Game</span>
              <span className="pull-right">{this.state.ppg}</span>
            </li>
            <li className="table-view-cell">
              <span className="pull-left">Score</span>
              <span className="pull-right">{this.state.score}</span>
            </li>
            <li className="table-view-cell">
              <span className="pull-left">Rank</span>
              <span className="pull-right">{'#' + this.state.rank}</span>
            </li>
            <li className="table-view-cell table-view-divider"/>
            <li className="table-view-cell">
              <span className="pull-left">Member since</span>
              <span className="pull-right">{Moment(user.createdAt).format('L')}</span>
            </li>
            <li className="table-view-cell">
              <span className="pull-left">Last online</span>
              <span className="pull-right">{Moment(user.updatedAt).format('LLLL')}</span>
            </li>
            <li className="table-view-cell table-view-divider"/>
            <div className="content-padded">
              <button className="btn btn-outlined btn-negative btn-block" onClick={this.onLogoutClicked}>Logout</button>
              <button className="btn btn-outlined btn-negative btn-block">Reset Stats</button>
              <button className="btn btn-outlined btn-negative btn-block">Delete Account</button>
            </div>
          </ul>
        </div>;
      return profile;
    }
  });
});
