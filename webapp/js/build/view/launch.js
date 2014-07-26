/** @jsx React.DOM */
define([
  'config/Ids',
  'parse',
  'react',
  'fastclick',
  'view/AppView',
  'ratchet'
], function (Ids, Parse, React, FastClick, AppView) {
  Parse.initialize(Ids.Parse.AppId, Ids.Parse.JavaScriptKey);
  React.initializeTouchEvents(true);
  
  function launch() {
    FastClick.attach(document.body);
    React.renderComponent(AppView(null), document.getElementById("app"));
  }

  window.fbAsyncInit = function () {
    Parse.FacebookUtils.init({
      appId: Ids.Facebook.AppId,
      channelUrl: 'http://meta.parseapp.com',
      cookie: true,
      xfbml: true
    });

    var isCordova = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
    if (isCordova) {
      document.addEventListener("deviceready", launch, false);
    } else {
      launch();
    }
  };

  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
});