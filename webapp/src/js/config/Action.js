define(function () {
  /**
   * @Deprecated
   */
  var Action = {
    Cooperate: 'cooperate',
    Pass: 'pass',
    Defect: 'defect'
  };

  Object.defineProperty(Action, 'values', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      return Object.keys(Action).map(function (v) {
        return Action[v];
      });
    }
  });

  Object.defineProperty(Action, 'random', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function () {
      return Action.values()[getRandomInt(Object.keys(Action).length)];
    }
  });
  
  return Object.freeze(Action);
});
