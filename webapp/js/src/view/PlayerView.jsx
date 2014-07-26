define([
  'react'
], function (React) {
  return React.createClass({
    render: function () {
      var user = this.props.user.toJSON();

      var comp =
        <div className="other">
          <div className="banner" style={{backgroundImage: "url(" + user.bannerUrl + ")"}} />
          <div className="shield"/>
          <div className="profilepic">
            <img src={user.pictureUrl} />
            <div className="level dot-pos">
              <span className="dot">1</span>
            </div>
            <div className="rank dot-pos">
              <span className="dot">{'#'}0</span>
            </div>
            <div className="lastmoves">
              <div className="move co"/>
              <div className="move co"/>
              <div className="move de"/>
              <div className="move pa"/>
              <div className="move co"/>
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
      return comp;
    }
  });
});
