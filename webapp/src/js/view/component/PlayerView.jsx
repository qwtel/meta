define([
  'react'
], function (React) {
  return React.createClass({
    render: function () {
      var user = this.props.user.toJSON();
      var statsSheet = this.props.user.get('statSheet');

      var dots = null;
      var level, rank;
      if (statsSheet && (level = statsSheet.get('level')) !== undefined && (rank = statsSheet.get('rank')) !== undefined) {
        dots = [
          <div className="level dot-pos">
            <span className="dot">{level}</span>
          </div>,
          <div className="rank dot-pos">
            <span className="dot">{'#' + rank}</span>
          </div>
        ];
      }

      var playerView =
        <div className="other">
          <div className="banner-wrapper">
            { user.bannerUrl ? <div className="banner" style={{backgroundImage: "url(" + user.bannerUrl + ")"}} /> : null }
          </div>
          <div className="shield"/>
          <div className="profilepic">
            { user.pictureUrl ? <img src={user.pictureUrl} /> : null }
            {dots}
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
