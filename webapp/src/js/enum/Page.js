define([
  'enum/Enum'
], function(Enum) {

  var Page = new Enum({
    Login: 'login',
    Profile: 'profile',
    Play: 'play',
    History: 'history',
    NotFound: '404'
  });

  return Page;
});

