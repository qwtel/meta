Parse.Cloud.afterSave(Parse.User, function (request, response) {
  Parse.Cloud.useMasterKey();
  
  console.log("Saving User..");
  
  var user = request.object;
  
  if (!user.get('statSheet')) {
    console.log("New user, creating StatSheet");

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
        response.error(error);
      })
      .then(function () {
        response.success();
      }, function(error) {
        console.log('Something when wrong with saving the user', error);
        response.error(error);
      });
  }
});
