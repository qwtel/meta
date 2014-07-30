define([
  'react'
], function (React) {
  return React.createClass({
    getInitialState: function () {
      // TODO: Don't store this here
      return {
        level: '',
        rank: ''
      }
    },

    componentDidMount: function () {
      // TODO: Don't do this here
      var self = this;
      this.props.user.get('statSheet').fetch().then(function (statSheet) {
        self.setState(statSheet.attributes);
      });
    },

    render: function () {
      var user = this.props.user.toJSON();
      var playerView =
        <div className="other">
          <div className="banner" style={{backgroundImage: "url(" + user.bannerUrl + ")"}} />
          <div className="shield"/>
          <div className="profilepic">
            <img src={user.pictureUrl} />
            <div className="level dot-pos">
              <span className="dot">{this.state.level}</span>
            </div>
            <div className="rank dot-pos">
              <span className="dot">{'#' + this.state.rank}</span>
            </div>
            <div className="is-online dot-pos">
              { this.isOnline(user) ? <div className="dot"/> : null }
            </div>
          </div>
          <div className="about content-padded">
            <h4>
            {user.firstName}
            {user.minAge ? (', ' + user.minAge + '+') : ''}
            </h4>
            <div>
              <p>{user.about}</p>
            </div>
          </div>
        </div>;

      return playerView;
    },

    isOnline: function (user) {
      return new Date(user.updatedAt).getTime() + 1000 * 60 > new Date().getTime();
    }
  });
});
