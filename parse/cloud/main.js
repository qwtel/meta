Parse.Cloud.afterSave(Parse.User, function (req, res) {
  var user = req.object;
  
  if (!user.get('statSheet')) {
    console.log("New user, creating StatSheet");
    
    Parse.Cloud.useMasterKey();

    var StatSheet = Parse.Object.extend("StatSheet");
    var statSheet = new StatSheet();
    statSheet.set({
      user: user,
      level: 1,
      points: 0,
      ppg: 0,
      score: 0,
      rank: 0
    });
    
    statSheet.save()
      .then(function () {
        user.set('statSheet', statSheet);
        return user.save();
      }, function (error) {
        console.log('Something when wrong with saving the statSheet', error);
        res.error(error);
      })
      .then(function () {
        res.success();
      }, function(error) {
        console.log('Something when wrong with saving the user', error);
        res.error(error);
      });
  }
});

Parse.Cloud.define("temp", function (req, res) {
  if (req.user.authData.facebook.id == '10202226173755916') {
    Parse.Cloud.useMasterKey();

    var Bot = Parse.Object.extend("Bot");
    var bot = new Bot();
    
    bot.set({
      firstName: 'Coop Bot',
      about: 'I always cooperate',
      
    });
    
    bot.save({
      success: res.success,
      error: res.error
    });
  }
});

Parse.Cloud.define("getGame", function (req, res) {
  res.success({
    enemy: 'test',
    state: 'state'
  });
});
