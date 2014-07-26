define([
  'service/UserService',
  'view/component/HistoryGameView',
  'react'
], function (UserService, HistoryGameView, React) {
  return React.createClass({
    render: function () {
      var historyPage =
        <div className="content">
          <ul className="table-view history" style={{marginTop: 0}}>
            <li className="table-view-divider">Today</li>
            <HistoryGameView />
            <HistoryGameView />
            <li className="table-view-divider">Yesterday</li>
            <HistoryGameView />
            <HistoryGameView />
            <HistoryGameView />
            <HistoryGameView />
            <HistoryGameView />
          </ul>
        </div>;

      return historyPage;
    }
  });
});
