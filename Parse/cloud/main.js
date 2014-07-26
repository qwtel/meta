Parse.Cloud.afterSave(Parse.User, function (request, response) {
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
        response.error(error);
      })
      .then(function () {
        response.success();
      }, function(error) {
        response.error(error);
      });
  }
});

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
/*
 Parse.Cloud.define("hello", function(request, response) {
 response.success("Meta meta meta!");
 });

 Parse.Cloud.beforeSave("Review", function(request, response) {
 if (request.object.get("stars") < 1) {
 response.error("you cannot give less than one star");
 } else if (request.object.get("stars") > 5) {
 response.error("you cannot give more than five stars");
 } else {
 response.success();
 }
 });

 Parse.Cloud.define("averageStars", function(request, response) {
 var query = new Parse.Query("Review");
 query.equalTo("movie", request.params.movie);
 query.find({
 success: function(results) {
 var sum = 0;
 for (var i = 0; i < results.length; ++i) {
 sum += results[i].get("stars");
 }
 response.success(sum / results.length);
 },
 error: function() {
 response.error("movie lookup failed");
 }
 });
 });

 function tmp() {
 }
 */
