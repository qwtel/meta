define([
  'react'
], function (React) {
  return React.createClass({
    render: function () {
      var left, right;

      var Titles = {
        play: 'Play',
        history: 'History',
        profile: 'Profile',
        login: 'Meta'
      };

      if (this.props.page === 'play') {
        var newHistory;
        if (this.props.newHistory && this.props.newHistory > 0) {
          newHistory = <span className="badge">{this.props.newHistory}</span>
        }

        left =
            <a className="btn btn-link btn-nav pull-left" href="#/profile">
              <span className="icon icon-left-nav"></span>
              {' '}
              {'Profile'}
            </a>;
        right =
            <a className="btn btn-link btn-nav pull-right" href="#/history">
              {newHistory}
              {'History'}
              {' '}
              <span className="icon icon-right-nav"></span>
            </a>;
      } else if (this.props.page === 'profile') {
        right =
            <a className="btn btn-link btn-nav pull-right" href="#/play">
              {'Play'}
              {' '}
              <span className="icon icon-right-nav"></span>
            </a>;

      } else if (this.props.page === 'history') {
        left =
            <a className="btn btn-link btn-nav pull-left" href="#/play">
              <span className="icon icon-left-nav"></span>
              {' '}
              {'Play'}
            </a>;
      }
      
      var meter = null;
      if (this.props.width !== undefined) {
        meter =
          <div className="meter">
            <span style={{width: (this.props.width * 100) + "%"}} />
          </div>
      }

      var header =
          <header className="bar bar-nav">
            {left}
            {right}
            <h1 className="title">{Titles[this.props.page]}</h1>
            {meter}
          </header>;

      return header;
    }
  });
});
