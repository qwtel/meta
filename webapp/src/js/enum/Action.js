define([
  'enum/Enum'
], function(Enum) {
  
  var Action = new Enum({
    Cooperate: 'cooperate',
    Pass: 'pass',
    Defect: 'defect'
  }, {
    random: function () {
      return Action.values()[getRandomInt(Action.keys().length)];
    }
  });
  
  return Action;
});
