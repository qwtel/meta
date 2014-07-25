define([
  'service/UserService',
  'view/PlayerView',
  'react',
  'moment',
  'parse'
], function (UserService, PlayerView, React, Moment) {
  return React.createClass({
    onSaveClicked: function () {
      var firstName = this.refs.name.getDOMNode().value;
      var about = this.refs.message.getDOMNode().value;

      if (firstName && (firstName = firstName.trim()) !== '' &&
        about && (about = about.trim()) !== '') {

        this.props.user.set({
          firstName: firstName,
          about: about
        });

        UserService.save(this.props.user).then(function() {
          this.forceUpdate();
        }.bind(this));
      }
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
              <span className="pull-right">1</span>
            </li>
            <li className="table-view-cell">
              <span className="pull-left">Points</span>
              <span className="pull-right">0</span>
            </li>
            <li className="table-view-cell">
              <span className="pull-left">Points per Game</span>
              <span className="pull-right">0</span>
            </li>
            <li className="table-view-cell">
              <span className="pull-left">Score</span>
              <span className="pull-right">0</span>
            </li>
            <li className="table-view-cell">
              <span className="pull-left">Rank</span>
              <span className="pull-right">{'#0'}</span>
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
          </ul>
        </div>;
      return profile;
    }
  });
});
