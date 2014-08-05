/** @jsx React.DOM */
define([
  'config/Config',
  'view/AppView',
  'react',
  'fastclick'
], function (Config, AppView, React, FastClick) {
  Parse.initialize(Config.Parse.AppId, Config.Parse.JavaScriptKey);
  React.initializeTouchEvents(true);
  
  function main() {
    FastClick.attach(document.body);
    React.renderComponent(AppView(null), document.getElementById("app"));
  }
  
  window.fbAsyncInit = function () {
    Parse.FacebookUtils.init({
      appId: Config.Facebook.AppId,
      channelUrl: Config.ChannelUrl,
      cookie: true,
      xfbml: true
    });

    var isCordova = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
    if (isCordova) {
      document.addEventListener("deviceready", main, false);
    } else {
      main();
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